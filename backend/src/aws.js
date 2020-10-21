const AWS = require('aws-sdk')
const debug = require('debug')('aws')
let s3;
try{
  s3= new AWS.S3({region: 'ap-south-1'});
}
catch(e){
  debug(e)
}

module.exports = function(app) {
  app.set('aws',AWS)
  app.set('s3',s3)
  
}