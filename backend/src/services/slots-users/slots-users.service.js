// Initializes the `slots-users` service on path `/slots-users`
const { SlotsUsers } = require('./slots-users.class');
const createModel = require('../../models/slots-users.model');
const hooks = require('./slots-users.hooks');

module.exports = function (app) {
  const options = {
    Model: createModel(app),
    paginate: app.get('paginate'),
    multi: [ 'create' ],
    id: 'slot_id'
  };

  // Initialize our service with any options it requires
  app.use('/slots-users', new SlotsUsers(options, app));

  // Get our initialized service so that we can register hooks
  const service = app.service('slots-users');

  service.hooks(hooks);
};
