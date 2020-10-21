/* eslint-disable no-unused-vars */
exports.Ratings = class Ratings {
  constructor (options) {
    this.options = options || {};
  }

  setup(app)
  {
    this.app = app
  }
  async find (params) {
    return [];
  }

  async get (id, params) {
    return {
      id, text: `A new message with ID: ${id}!`
    };
  }

  async create (data, params) {
    
    let db = this.app.get('knexClient')
    return db('ratings').insert(data)
  }

  async update (id, data, params) {
    return data;
  }

  async patch (id, data, params) {
    return data;
  }

  async remove (id, params) {
    return { id };
  }
};
