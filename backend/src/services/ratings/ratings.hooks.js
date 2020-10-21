const { authenticate } = require('@feathersjs/authentication').hooks;
const { validateSchema, disallow } = require('feathers-hooks-common')

const debug = require('debug')('ratings/hooks')

const { ajv } = require('../../util/ajv')
const schema = require('./ratings.schemas')

  
module.exports = {
  before: {
    all: [ authenticate('jwt') ],
    find: [],
    get: [],
    create: [ validateSchema(schema.create, ajv) ],
    update: [disallow()],
    patch: [disallow()],
    remove: []
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
