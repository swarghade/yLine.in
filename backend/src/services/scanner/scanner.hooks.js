const { authenticate } = require('@feathersjs/authentication').hooks;
const { validateSchema, iff, disallow} = require('feathers-hooks-common')

const { ajv } = require('../../util/ajv')
const schemas = require('./scanner.schemas')
const { validateParams } = require('../slots/helpers/slots.utils')


module.exports = {
  before: {
    all: [ authenticate('jwt') ],
    find: [ disallow() ],
    get: [ disallow() ],
    create: [ disallow() ],
    update: [ disallow() ],
    patch: [  ],
    remove: [ disallow( ) ]
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
