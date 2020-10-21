const common = require('../../util/common')
const temp = {
  roles: {
    type: 'array',
    items: { 
      type: 'integer',
      maximum: 1000
    }
  }
}



module.exports = {
  find: {
    properties: {
      id: common.id
    }
  },
  get : {
    required: ['id'],
    properties: {
      id: common.id,
    }
  },
  create: {
    required: [/*'email','password'*/],
    properties: {
      email: common.email,
      password: common.password,
      roles: temp.roles
    }
  },
  update: {
    required: [],
    minProperties: 1,

    properties: {
      id: common.id,
      email: common.email,
      password: common.password,
      roles: temp.roles
    },
        
  },
  remove: {
    required: [],
    properties: {
      id: common.id
    }
  }
}