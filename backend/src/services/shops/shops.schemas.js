//const primaryKey = 'client_id';

const common = require('../../util/common')

let temp = {
  address: {
    type: 'string',
    maxLength: 255,
    minLength: 3
  },
  lat: {
    type: 'string',
    maxLength: 24
  },
  city: {
    type: 'string',
    maxLength: 50
  },
  state: {
    type: 'string',
    maxLength: 50
  },
  zip_code: {
    type: 'integer',
    min: 1,
    maximum: 999999
  }
}

module.exports = {

  find: {
    properties: {
      category_id: {
        type: 'array',
        items: {
          type: 'integer'
        }
      },
      '$limit': {
        type: 'integer',
        maximum: 30
      },
      '$skip':{
        type: 'integer',
        minimum: 1
      }
    }
  },
  get: {
  },

  create : {
    required:['name','start_time','end_time','category_id','gps','address','phone_numbers','city','state','zip_code'] ,
    additionalProperties: false,
    properties: {
      name: common.name,
      start_time: {
        format: 'custom-time'
      },
      end_time: {
        format: 'custom-time'
      },
      interval: {
        type: 'integer',
        maximum: 720
      },
      gps: {
        type: 'object',
        properties: {
          latitude: temp.lat,
          longitude: temp.lat
        }
      },
      category_id: {
        type: 'integer'
      },
      phone_numbers: {
        type: 'array',
        items: {
          type: 'string',
          minLength: 12,
          maxLength: 14
        }
      },
      address: temp.address,
      city: temp.city,
      state: temp.state,
      zip_code: temp.zip_code
    },
  },

  update : {
    anyRequired:['name','start_time','end_time','gps','category_id','address','phone_numbers','city','state','zip_code','interval'] ,
    additionalProperties: false,
    properties: {
      name: common.name,
      start_time: {
        format: 'custom-time'
      },
      end_time: {
        format: 'custom-time'
      },
      interval: {
        type: 'integer',
        maximum: 720
      },
      gps: {
        type: 'object',
        properties: {
          latitude: temp.lat,
          longitude: temp.lat
        }
      },
      category_id: {
        type: 'integer'
      },
      phone_numbers: {
        type: 'array',
        items: {
          type: 'string',
          maxLength: 14
        }
      },
      address: temp.address,
      city: temp.city,
      state: temp.state,
      zip_code: temp.zip_code
    },
  },

  remove : {
    id: common.id
  }
  

}