//const primaryKey = 'client_id';

const common = require('../../util/common')

return {
    
  get: {
    properties: {
      client_id: common.id,
      limit: common.limit,
      offset: common.offset
    }
  },

  create : {
    required:['name','state','address','project_type'
    ] ,
    properties: {
            
      name: common.name,
            
            
    },
        
  },

  update : {
    anyRequired: ['name','state','address','gst_no','project_type'],
    required: ['client_id'],
    properties: {
      client_id: common.id,
      name: common.name,
      state: common.state,
      address: common.address,
      gst_no: common.gst_no,
      project_type: {
        type: 'string',
        minLength: 3,
        maxLength: 64

      }
    },
        
  },

  remove : {

    required: ['client_id'],
    properties: {
      client_id: common.id
    },
  }
  

}