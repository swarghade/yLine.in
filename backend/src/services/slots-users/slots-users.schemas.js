//const primaryKey = 'client_id';

const common = require('../../util/common')

return {
    
  get: {
  },

  create : {
    required:['slot_id','user_id'] ,
    properties: {
      slot_id: common.id,
      user_id: common.id
    },
  },

  update : {
    required: ['slot_id','user_id'],
    properties: {
      slot_id: common.id,
      user_id: common.id
    },
        
  },

  remove : {
    
  }
  

}