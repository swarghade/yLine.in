// Initializes the `errorlog4245` service on path `/errorlog-4245`
const { Errorlog4245 } = require('./errorlog4245.class');
const hooks = require('./errorlog4245.hooks');

module.exports = function (app) {
  const options = {
    paginate: app.get('paginate')
  };

  // Initialize our service with any options it requires
  app.use('/errorlog-4245', new Errorlog4245(options, app));

  // Get our initialized service so that we can register hooks
  const service = app.service('errorlog-4245');

  service.hooks(hooks);
};
