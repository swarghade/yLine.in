module.exports = {
  create: {
    properties: {
      su_id: {
        type: 'integer',
        minimum: 0
      },
      shop_id: {
        type: 'integer',
        minimum: 0
      },
      rating: {
        type: 'integer',
        minimum: 0,
        maximum: 5
      },
      message: {
        type: 'string',
        minLength: 3
        
      }
    }
  }
}