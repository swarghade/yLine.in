const common = require('../../util/common')

module.exports = {
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
}