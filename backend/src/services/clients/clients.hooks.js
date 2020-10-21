const { authenticate } = require('@feathersjs/authentication').hooks

//const Ajv = require('ajv');
//const ajv = new Ajv({ allErrors: true, $data: true });
//const schema = require('./clients.schemas.js');



module.exports = {
  before: {
    all: [ authenticate('jwt') ],
    find: [],
    get: [],
    create: [],
    update: [],
    patch: [],
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
}
