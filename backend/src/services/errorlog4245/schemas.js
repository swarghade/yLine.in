//const { id } = require('../../util/common')

module.exports = {
  patch :  {
    type: 'object',
    required: ['roles'],
    properties: {
      roles: {
        type: 'array',
        additionalItems: false,
        minItems: 1,
        maxItems: 3,
        items : {
          type: 'string',
          maxLength: 7,
        }
      }
    }
  },
  'id' : {
    type: 'integer'

    
  }

}