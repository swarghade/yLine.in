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
  limit: {
    type: 'integer',
    maximum: 1000
  }
}

module.exports = {

  params: {
    _autogenerate: {
      required: ['start','end','interval','limit'],
      properties: {
        autogenerate: {
          type: 'integer',
          minimum: 1,
          maximum: 2
        },
        start: {
          type: 'string',
          maxLength: 5,
          pattern: '\\d{2}:\\d{2}'
        },
        end: {
          type: 'string',
          maxLength: 5,
          pattern: '\\d{2}:\\d{2}'
        },
        interval: {
          type: 'integer'
        },
        date: {
          type: 'string',
          format: 'custom-date'
        },
        limit: temp.limit
      }
    },
    _scanner: {
      required: ['shop_id','user_id'],
      properties: {
        scanner: {
          type: 'integer',
          minimum: 1,
          maximum: 2
        },
        shop_id: common.id,
        user_id: common.id
      }
      
    }
  },
  find: {

  },
  get: {
    slot_id: common.id
  },
  create : {
    if: { type: 'object' },
    then: {
      required:['slot_start','slot_end','date'] ,
      properties: {
        shop_id: common.id,
        slot_start: {
          format: 'custom-time'
        },
        slot_end: {
          format: 'custom-time'
        },
        date: {
          format: 'custom-date'
        },
        text: temp.address,
        limit: common.id
        
      },
    },
    else: {
      type: 'array',
      items: {
        required:['slot_start','slot_end','date'] ,
        properties: {
          shop_id: common.id,
          slot_start: {
            format: 'custom-time'
          },
          slot_end: {
            format: 'custom-time'
          },
          date: {
            format: 'custom-date'
          },
          text: temp.address,
          limit: common.id
          
        },
      }
    }
  },


  update : {
    anyRequired: ['shop_id','slot_start','slot_end','date','text'] ,
    properties: {
      shop_id: common.id,
      slot_start: {
        format: 'custom-time'
      },
      slot_end: {
        format: 'custom-time'
      },
      date: {
        format: 'custom-date'
      },
      text: temp.address
      
    },
  },

  remove : {

  }


}