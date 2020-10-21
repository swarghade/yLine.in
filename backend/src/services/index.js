const users = require('./users/users.service.js')
const clients = require('./clients/clients.service.js')
const shops = require('./shops/shops.service.js')
const slots = require('./slots/slots.service.js')
const slotsUsers = require('./slots-users/slots-users.service.js');
const errorlog4245 = require('./errorlog4245/errorlog4245.service.js');
const scanner = require('./scanner/scanner.service.js');

const ratings = require('./ratings/ratings.service.js');

const category = require('./category/category.service.js');

// eslint-disable-next-line no-unused-vars
module.exports = function (app) {
  app.configure(users)
  app.configure(clients)
  app.configure(shops)
  app.configure(slots)
  app.configure(slotsUsers);
  app.configure(errorlog4245);

  app.configure(scanner);
  app.configure(ratings);
  app.configure(category);
}
