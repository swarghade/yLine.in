const { Service } = require('feathers-knex');

exports.Category = class Category extends Service {
  constructor(options) {
    super({
      ...options,
      name: 'category'
    });
  }
};
