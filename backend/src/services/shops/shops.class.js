const { Service } = require('feathers-knex')
const { Forbidden } = require('@feathersjs/errors')
const debug = require('debug')('shops')
const { intersection, clone , omit, pick } = require('lodash')

exports.Shops = class Shops extends Service {
  constructor(options) {
    super({
      ...options,
      name: 'shops'
    })
  }

  setup(app){
    this.app = app
  }

  async find(params){

    if(params.query.latitude && params.query.longitude && params.query.distance)
    {
    
      let db = this.Model
      let point = db.raw('ST_Point(?,?)',[ params.query.latitude, params.query.longitude ])
      let within = db.raw('ST_DWithin(shops.gps,?,?)',[point, params.query.distance])
      let distance = db.raw('ST_Distance(?,shops.gps) as d_meter',[ point ])
      debug(' Distance %o ', params.query)
      debug(' query -> %o ', (db('shops').where(within)).toString())

      let allowedQuery = pick(params.query,['$limit','$skip','$sort','state','city','$like','x_deleted'])
      let omitted = omit(params.query,['distance','latitude','longitude'])
      let rating = db.raw('( SELECT ROUND( AVG( rating ) ) FROM ratings WHERE ratings.shop_id = shops.shop_id ) as rating')

      console.log(params.query.category_id)
      
      let queryRes = await db('shops')
      .select( 'shops.*', distance, rating, 'category.name as category_name').orderBy('d_meter','asc')
      .where(allowedQuery)
      .join('category','category.id','=','shops.category_id')
      .andWhere( within )
      .modify( (query) =>  {
        if(params.query.category_id)
        {
          let categoryIds = params.query.category_id.map( (k) => Number(k) )
          query.whereIn('category_id',categoryIds)
        }
          
        
        if(params.query.rating)
        {
          query.select(rating)
          query.whereRaw('( SELECT ROUND( AVG( rating ) )::integer FROM ratings WHERE ratings.shop_id = shops.shop_id ) = ?',[params.query.rating])
        }

      } )

      //return db('shops')
        return Promise.resolve({ data: queryRes })
  
    }
    else
      return super.find(params)
  }

  async get(id,params){

    debug('in get')
    debug(id)
    debug(params)
    let db = this.Model
    
    let rating = db.raw('( SELECT ROUND( AVG( rating ) )::integer FROM ratings WHERE ratings.shop_id = shops.shop_id ) as rating')

    let query = await db('shops')
    .select( 'shops.*',rating,'category.name as category_name' )
    .join('category','category.id','=','shops.category_id')
    .where({ shop_id: id })
    .andWhere(params.query)

    return query[0]
  }
  

  async create(data,params){

    let db = this.Model
    let res
    try{
      res = await db.transaction( async (knex) => {
        data.shop_id = params.user.id
        //set gps
        let temp = [ data.gps.latitude, data.gps.longitude ]
        data.latitude = temp[0]
        data.longitude = temp[1]
        data.gps = db.raw('ST_Point(?,?)',temp)
  
        let d = await knex('shops').insert(data).returning('*')
        if(d)
        {
          let userRoles = await knex('users').select('roles').where({ id : params.user.id })
          debug(`userRoles -> %o `,userRoles[0])
          let newRoles = userRoles[0].roles
          newRoles.push('shop')
          debug(` new Roles %o `,newRoles)
          let userUpdate = await knex('users').update({ roles : newRoles }).where({ id : params.user.id })
          
          debug(userUpdate)
          if(userRoles && userUpdate)
            return d
        }
        
      } )
    
    }
    catch(e){
      debug('%o',e)
      throw e
    }
    //set id

    return res
    
  }

  async update(id,data,params){

    let db = this.Model

    if( ( params.user.roles && !intersection(params.user.roles,['admin','owner','shop']) ) || params.user.id != id )
    {
      throw new Forbidden('Not allowed')
    }
    
    data.x_deleted = false
    let newData = clone(data)
    

    //check if gps
    if(data.gps)
    {
      let temp = [ newData.gps.latitude, newData.gps.longitude ]
      newData.gps = db.raw('ST_Point(?,?)',temp)
      newData.latitude = data.gps.latitude
      newData.longitude = data.gps.longitude
    }
    
    return await db('shops').update(newData).where({ shop_id: id }).returning('*')
  
  }

  async patch(id,data,params){

    debug('in patch')

    try{
      let db = this.Model

      if( ( params.user.roles && !intersection(params.user.roles,['admin','owner','shop']) ) || params.user.id != id )
      {
        throw new Forbidden('Not allowed')
      }
      


      //check if gps
      data.x_deleted = false
      let newData = clone(data)
      
      //check if gps
      if(data.gps)
      {
        let temp = [ newData.gps.latitude, newData.gps.longitude ]
        newData.gps = db.raw('ST_Point(?,?)',temp)
        newData.latitude = data.gps.latitude
        newData.longitude = data.gps.longitude
      }

      let r = await db.transaction( async(knex) => {

        let userQuery = null
        if(!params.user.roles.includes('shop'))
          userQuery = await knex('users').update( { roles: knex.raw("ARRAY_APPEND(users.roles,'shop')") } ).where({ id: id })
        else
          userQuery = true
        
        let shopQuery = await knex('shops').update(newData).where({ shop_id: id }).returning('*')
        
        debug('userQuery')
        debug(userQuery)
        debug('shop Query')
        debug(shopQuery)

        if(userQuery && shopQuery)
        return shopQuery
      } )
      
      return Promise.resolve(r)
    }

    catch(e){
      debug(e)
      throw e
    }
    
    
  }

  async remove(id, params){
    debug('in remove')
    debug(params.user)
    try{
      let db = this.Model

      let r = await  db.transaction( async (knex) => {

        let s = await knex('shops').where({ shop_id: params.user.id }).update({ x_deleted: true })
        let u = await knex('users').update({  roles :  knex.raw("ARRAY_REMOVE(users.roles,'shop')") } ).where({ id: params.user.id })

        if(s & u)
        return s
      } )

      return Promise.resolve(r)
    }
    catch(e){
      debug(e)
      throw e
    }
    
    
  }

}
