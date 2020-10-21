const { authenticate } = require('@feathersjs/authentication').hooks;
const { disallow, validateSchema } = require('feathers-hooks-common')
const schemas = require('./schemas')
const { ajv } = require('../../util/ajv')
const { BadRequest } = require('@feathersjs/errors')

const idValidator = ajv.compile(schemas.id)


function validateId( validator ){

  return  (context)  =>  {

    if(!validator(context.id))  
    {
      throw new BadRequest(validator.errors)
    }
      
    
    return context
  }
  
  
}

module.exports = {
  before: {
    all: [ authenticate('jwt') ],
    find: [disallow()],
    get: [disallow()],
    create: [disallow()],
    update: [disallow()],
    patch: [ validateSchema(schemas.patch, ajv),validateId(idValidator), ],
    remove: [disallow()]
  },

  after: {
    all: [],
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
};
