const Moment = require('moment')
const MomentRange = require('moment-range')
const moment = MomentRange.extendMoment(Moment)
const check = require('check-types')
const { BadRequest } =  require('@feathersjs/errors')

function timeSlotGenerator(start, end, interval, shop_id, date, limit){

  if( check.emptyString(start) || check.emptyString(end) || !check.integer(interval) || !check.greater(interval,0)|| !check.greater(limit,0))
  {
    throw new Error('Invalid parameter')
    
  }
  let dump = '2000-12-01 '
  let s  = moment(dump+start,'YYYY-MM-DD HH:mm')
  let e = moment(dump+end,'YYYY-MM-DD HH:mm')

  let range = moment.range(s, e)
  let hours = Array.from(range.by('minutes', { step: interval, excludeEnd: false }))

  let res = hours.map((m,i,arr) => {
    if( i < arr.length-1 )
      return {
        shop_id: shop_id,
        date: date,
        slot_start: m.format('HH:mm'), 
        slot_end: arr[i+1].format('HH:mm') ,
        limit: limit
      }
    else
      null
  })

  return res.filter( (k) => k!=null )

}


function validateParams( validator ){

  return  (context)  =>  {
    if(!validator(context.params.query))  
    {
      throw new BadRequest(validator.errors)
    }
      
    
    return context
  }
  
  
}

module.exports = { timeSlotGenerator, validateParams }