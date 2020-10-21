const { Service } = require('feathers-knex')
const { NotFound } = require('@feathersjs/errors')

const { timeSlotGenerator } = require('./helpers/slots.utils')
const moment = require('moment')

const debug = require('debug')('slots-class')

debug('Starting slots-class')

exports.Slots = class Slots extends Service {
  constructor(options) {
    super({
      ...options,
      name: 'slots'
    })
  }

  setup(app)
  {
    this.app = app
  }

  find(params)
  {
  // to display shop wise
  // client perspective
    const db = this.app.get('knexClient')

    return db.where( { ...params.query } )
      .from(db.raw(' slots slots, LATERAL ( SELECT COUNT(*) FROM slots_users su WHERE su.slot_id = slots.slot_id ) bookings '))
      .select(' slots.*', db.raw('bookings.count::integer as bookings'),db.raw('((slots.limit - bookings.count) > 0)::boolean AS is_available') )

  }
  async get(id,params)
  {
    
    if(false == true)
    {
      // make sure shop owner has called it
      if(params.query.shop_id == params.user.id)
      {
        let db = this.Model
        let q = await db('slots_users')
          .join('slots','slots.slot_id','=','slots_users.slot_id')
          .where(
            {
              'slots.shop_id' : params.query.shop_id,
              'user_id' : params.query.user_id,
              'slots_users.slot_id' : id
            } ).where('slots.date',moment(new Date(),'DD/MM/YYYY'))

            
        if(q.length <= 0 )
          throw new NotFound('No slots')
        else
          return q
      }
      
      
    }
    else
    {
      const db = this.app.get('knexClient')

      return db.where( { slot_id : id, ...params.query } )
        .from(db.raw(' slots slots, LATERAL ( SELECT COUNT(*) FROM slots_users su WHERE su.slot_id = slots.slot_id ) bookings '))
        .select(' slots.*', 'bookings',db.raw('((slots.limit - bookings.count) > 0)::boolean AS is_available') )

    }
  }

  async create(data,params)
  {
    debug('create Slots')
    debug(' params -> %O',params.query)
    if(params.query.autogenerate)
    {
      debug('in autogenerate')
      let db = this.Model
      let sRes = await db('shops').where({ shop_id: params.user.id})
      let s_id = sRes[0].shop_id
      
      debug(' Data - %o',data)
      let date = null
      if(data.date)
      {
        debug(' data.date -> %o ',data.date)
        date = moment(data.date,'DD/MM/YYYY').format('LL')
        debug(' Moment:date -> %o ',date)
      }
      else
        date = moment().format('DD/MM/YYYY')

      return db('slots').insert(timeSlotGenerator(data.start, data.end, Number(data.interval), s_id, date , data.limit ))

    }
    else
    {
      let newData = data.map( (k,i) => {
        k.shop_id = params.user.id
        k.date = moment(k.date,'DD/MM/YYYY').format('LL')
        return k
      } )
      return super.create(newData,params)
    }
      
  }

  update(id,data,params)
  {
    return super.update(id,data,params)
  }

  patch(id,data,params)
  {
    return super.patch(id,data,params)
  }

  remove(id)
  {
    return super.remove(id)
  }



}
