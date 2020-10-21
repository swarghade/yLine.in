const { authenticate } = require('@feathersjs/authentication').hooks

const { hashPassword, protect } = require('@feathersjs/authentication-local').hooks
const { validateSchema } = require('feathers-hooks-common')

const { ajv } = require('../../util/ajv')
const schemas = require('./users.schemas')
const debug = require('debug')('users')

const { Forbidden } = require('@feathersjs/errors')


debug('booting users')

//const checkPermissions = require('feathers-permissions');
//    update: [ hashPassword('password'),  authenticate('jwt'), validateSchema(schemas.patch, ajv)],

const isloggedIn = () => {

  return (context) => {
    if(context.params.user)
    {
      throw new Forbidden('You are already logged in')
    }
    else
      return context
  }

}

/* iff( isloggedIn() , () => new Forbidden('You are already logged in')  ), */
module.exports = {
  before: {
    all: [  ],
    find: [ 
      authenticate('jwt'), 
      validateSchema(schemas.find, ajv)
    ],
    get: [ 
      authenticate('jwt'), 
      validateSchema(schemas.get, ajv)
    ],
    create: [  
      //authenticate('jwt'),
      isloggedIn(),
      validateSchema(schemas.create, ajv), 
      protect('roles'),
      hashPassword('password'),
      
    ],
    update: [  
      authenticate('jwt'), 
      validateSchema(schemas.update, ajv), 
      protect('roles'),
      hashPassword('password')
    ],
    patch: [  
      authenticate('jwt'), 
      validateSchema(schemas.update, ajv), 
      protect('roles'),
      hashPassword('password')
    ],
    remove: [ 
      authenticate('jwt'), 
      validateSchema(schemas.remove, ajv)
    ]
  },  

  after: {
    all: [ 
      // Make sure the password field is never sent to the client
      // Always must be the last hook
      protect('password')
    ],
    find: [],
    get: [],
    create: [],
    update: [],
    patch: [],
    remove: []
  },

  error: {
    all: [],
    find: [],
    get: [],
    create: [],
    update: [],
    patch: [],
    remove: []
  }
}
