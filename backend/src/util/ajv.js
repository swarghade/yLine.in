const Ajv = require('ajv')
const ajv = new Ajv({
  coerceTypes: true,
  $data: true
})

const moment = require('moment')

ajv.addFormat('custom-date', function(date) {

  if (typeof date === 'string' && date.length <= 10) {
    date = moment(date,'DD/MM/YYYY')
    return date.isValid() 
  }
  else 
    return false

})

ajv.addFormat('custom-time', function(time) {
  if (typeof time === 'string' && time.length <= 8) {
    t = moment(time,'HH:mm')
    return t.isValid() 
  }
  else 
    return false
})

module.exports = {
  ajv: ajv,
  moment: moment
}