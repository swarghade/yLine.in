const AWS = require('aws-sdk');

AWS.config.update({
  accessKeyId: 'AKIAJYZMGIBGNCWEYVJQ',
  secretAccessKey: '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',
  region: 'ap-south-1'
});

const sns = new AWS.SNS();

//exports.sendSMS =
function sendSMS(to_number, message, cb) {

  sns.publish({
    Message: message,
    Subject: 'Admin',
    PhoneNumber:to_number
  }, cb);

}

// Example
sendSMS('+918080864421', 'Hello from AWS', (err, result)=>{
  console.log('RESULTS: ',err,result)
})
