const Moment = require('moment');
const MomentRange = require('moment-range');
const moment = MomentRange.extendMoment(Moment);
const check = require('check-types')

function timeSlotGenerator(start,end,interval){

  if( check.emptyString(start) || check.emptyString(end) || !check.integer(interval) || !check.greater(interval,0))
  {
    throw new Error('Invalid parameter')
    
  }
  let dump = '2000-12-01 ';
  let s  = moment(dump+start,'YYYY-MM-DD HH:mm')
  let e = moment(dump+end,'YYYY-MM-DD HH:mm')

  let range = moment.range(s, e);
  let hours = Array.from(range.by('minutes', { step: interval, excludeEnd: false }));

  let res = hours.map((m,i,arr) => {
    if( i < arr.length-1 )
      return [ m.format('HH:mm'), arr[i+1].format('HH:mm') ]
    else
      null
  })

  return res.filter( (k) => k!=null );

}

module.exports = timeSlotGenerator

console.log(timeSlotGenerator( '01:00', 'b', 5  ))