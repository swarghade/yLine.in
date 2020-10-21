// Initializes the `slots` service on path `/slots`
const { Slots } = require('./slots.class')
const createModel = require('../../models/slots.model')
const hooks = require('./slots.hooks')

module.exports = function (app) {
  const options = {
    Model: createModel(app),
    paginate: app.get('paginate'),
    multi: ['create'],
    id: 'slot_id'
  }

  // Initialize our service with any options it requires
  app.use('/slots', new Slots(options, app))

  // Get our initialized service so that we can register hooks
  const service = app.service('slots')

  service.hooks(hooks)
}
