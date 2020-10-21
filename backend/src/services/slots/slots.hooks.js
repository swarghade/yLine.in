const { authenticate } = require('@feathersjs/authentication').hooks
const { validateSchema, iff } = require('feathers-hooks-common')

const { ajv } = require('../../util/ajv')
const schemas = require('./slots.schemas')
const { validateParams } = require('./helpers/slots.utils')

const autogenerateValidate = ajv.compile(schemas.params._autogenerate)


const debug=require('debug')('slots-class')
const check = require('check-types')



module.exports = {
  before: {
    all: [],
    find: [ 
      //authenticate('jwt'),
      /*iff( (context)=> check.assigned(context.params.query.scanner),
        validateParams(scannerValidate)
      ).else(validateSchema(schemas.find, ajv))*/
      
    ],
    get: [ 
      authenticate('jwt'), 
      validateSchema(schemas.get, ajv),
    ],
    create: [
      authenticate('jwt'), 
      iff( (context) =>  check.assigned(context.params.query.autogenerate) ,  
        [(context)=> debug('%o',context.data),validateSchema(schemas.params._autogenerate, ajv)]
      ).else([ (context) => debug('false triggered %o',context.params.query) , validateSchema(schemas.create, ajv) ])
    ],
    update: [
      authenticate('jwt'),
      validateSchema(schemas.update, ajv)  
    ],
    patch: [
      authenticate('jwt'),
      validateSchema(schemas.update, ajv)
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
