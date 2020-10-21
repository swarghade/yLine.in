const { Service } = require('feathers-knex');
const { Forbidden, Unprocessable, Unavailable, NotFound  } = require('@feathersjs/errors')
const debug = require('debug')('slots-users')
const check = require('check-types')


debug('Starting slots-users')

exports.SlotsUsers = class SlotsUsers extends Service {
  constructor(options) {
    super({
      ...options,
      name: 'slots_users'
    });
  }

  setup(app){
    this.app = app
  }

  find(params){
  //throw new Forbidden('This method is not allowed')
  // allow if admin OR user.id == params.user_id
    if(params.query.rating)
    {
      const db = this.Model

      return db('slots_users')
            .select('slots_users.*','slots.shop_id','shops.name')
            .join('slots','slots.slot_id','=','slots_users.slot_id')
            .join('shops','slots.shop_id','=','shops.shop_id')
            .where({ user_id: params.user.id, used: true })
            .whereRaw('(SELECT COUNT(id) FROM ratings WHERE ratings.su_id = slots_users.id) = 0')
    }
    else if(params.user.roles.includes('admin') || params.user.id == params.query.user_id)
    {
      const db = this.app.get('knexClient')
      
      return db('slots_users').where( { user_id: params.query.user_id } )
        .join( 'slots', 'slots.slot_id', '=', 'slots_users.slot_id' )
        .join('shops','shops.shop_id','=','slots.shop_id')
        .select('slots.shop_id','shops.name','slots.slot_start','slots.slot_end','slots_users.slot_id','slots_users.user_id','slots_users.used' ,db.raw('TO_CHAR( slots.date :: DATE, \'yyyy-mm-dd\' ) as date'),'slots_users.*','shops.address','shops.latitude','shops.longitude')
  
    }
    else
      throw new Forbidden('You have insufficient permissions.')
    
  }
  get(){
    throw new Forbidden('This method is not allowed')
  }
  patch(){
    throw new Forbidden('This method is not allowed')
  } 

  async create(data,params){

    debug('create')
    const db = this.Model

    let res;
    try{
      res = await db.transaction( async (knex) => {
        
        let copy = {}
        Object.assign(copy,data)

        debug('%o',copy)
        copy.user_id = params.user.id

        const slotsData = await knex.select('limit','shop_id',knex.raw('(CONCAT(slots.date,\' \',slots.slot_end)::timestamp > NOW()) AS is_valid'))
          .from('slots').where({ slot_id : copy.slot_id });
        debug('slotsData %o',slotsData)
        if(slotsData.length == 0 || !slotsData )
          throw new NotFound('slotsData is empty')
        if(slotsData[0].shop_id == params.user.id)
        {
          throw new Forbidden('You are not allowed to book a slot in your own shop ')
        }

        if(!slotsData[0].is_valid)
          throw new Forbidden('Slot expired')

        debug(' limit -> %o',slotsData[0].limit)
        const isSlotAvailable = await  knex('slots_users')
          .where({ slot_id: copy.slot_id })
          .count('slot_id',{as : 'slot_count'});
        
        debug('Slot available  -> %o',isSlotAvailable)

        if(isSlotAvailable[0].slot_count < slotsData[0].limit )
        {
          const input = await knex('slots_users').insert(copy)
          debug('%o',input)
          return input
        } 
        else
          throw new Unavailable('Slot\'s limit has exceeded')

      } )
    }
    catch(e){
      debug('%o',e)
      throw e
    }

    return res
  }

  update(id,data,params){

    /* automatically updated  */
    if( check.assigned(params.provider) )
    {
      /* Shop owner can update it's user's token */
      const db = this.Model
      const shopOwner = db('slots_users')
        .join('slots', 'slots.slot_id', '=', 'slots_users.slot_id' )
        .select('slots.shop_id')

      if(!shopOwner || shopOwner[0].shop_id == params.user.id)
      {
        throw new Forbidden('Only the shop owner can edit users\' token')
      }
    }

    return super.update(id,data,params)

  }

  async remove(id,params){
    if( check.assigned(params.provider) )
    {
      console.log(`params Query -> ${JSON.stringify(params.query,'',2)}`)
      const db = this.Model

      const slotDetail = 
        await db('slots_users')
          .where({ 'user_id': params.query.user_id, 'slots_users.slot_id': id })
          .join('slots','slots.slot_id','=','slots_users.slot_id')
          .select('slots_users.*','slots.shop_id')
      
      debug('user -> %o', params.user)
      debug('slot-detail -> %o - %o', slotDetail[0].user_id, typeof slotDetail[0].user_id)
      /* User may cancel a slot */
      
      if( params.user.id == slotDetail[0].user_id || params.user.id == slotDetail[0].shop_id )
      {
        return super.remove(id,params)
      }
      else
      {
        debug('Distinct user tried to remove a slot')
        throw new Forbidden('Only a user can remove a slot')
      }
      /* shop may cancel a slot */
      
    }
    
  }

};
