// Application hooks that run for every service

const errors = require("@feathersjs/errors")

const errorHandler = ctx => {
  if (ctx.error) {
    const error = ctx.error;
    //console.error(error)

    if (!error.code) {
      const newError = new errors.GeneralError("Something went wrong :( ");
      ctx.error = newError;
      return ctx;
    }
    
    if (error.code === 404 || process.env.NODE_ENV === "production" || process.env.NODE_ENV === 'development') {
      ctx.error.stack = null;
    }
    return ctx;
  }
};


module.exports = {
  before: {
    all: [],
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
    all: [errorHandler],
    find: [],
    get: [],
    create: [],
    update: [],
    patch: [],
    remove: []
  }
}
