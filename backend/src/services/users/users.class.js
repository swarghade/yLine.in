/* eslint-disable no-debugger */
const { Service } = require('feathers-knex')
const { Forbidden } = require('@feathersjs/errors')

const debug = require('debug')('users')

exports.Users = class Users extends Service {
  constructor(options) {
    super({
      ...options,
      name: 'users'
    })
  }

  setup(app){
    this.app = app
  }

  find(params){
  //throw new Forbidden()
    debug('****************** FIND **************** \n %o ',params)
    return super.find(params)

  }

  async get(id,params){
    if( params.provider && params.user && id != params.user.id )
      throw new Forbidden()

    debug('****************** GET **************** \n %o %o ',id,params.user)
    // knex first call users -> shops
    if( params.user && params.user.roles.includes('shop') )
    {
      const db = this.app.get('knexClient')
      const data = await db('users')
        .join('shops', 'shops.shop_id','=','users.id' )
        .where( { 'shops.shop_id' : params.user.id } )
        .select('users.*','shops.approved')

      return Promise.resolve( data[0] )
      
    }
    else
      return super.get(id,params)
  }

  create(data)
  {
    if(!data.roles)
      data.roles = ['client']

    return super.create(data)
  }

  update(id,data,params)
  {

    if( params.provider && id != params.user.id )
      throw new Forbidden()
  
      data.roles = ['client']
    
    return super.update(id,data,params)
  }

  patch(id,data,params)
  {

    if( params.provider && id != params.user.id )
      throw new Forbidden()

    return super.patch(id,data,params)
  }
}
