/* eslint-disable no-unused-vars */
const { Forbidden } = require('@feathersjs/errors');


exports.Errorlog4245 = class Errorlog4245 {
  constructor (options) {
    this.options = options || {};
  }

  setup(app){
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
    if (Array.isArray(data)) {
      return Promise.all(data.map(current => this.create(current, params)));
    }

    return data;
  }

  async update (id, data, params) {
    
  //return data;
  }

  async patch (id, data, params) {

    const roles = this.app.get('roles')
    data.roles.forEach( (k,i,a) => {
      let index = roles.indexOf(k)
      if(index == -1)
        throw new Forbidden(' Roles didn\'t match ')
    } )

    console.log('hi')

    const db = this.app.get('knexClient')
    let res = db.transaction( async (knex) => {

      
      if(params.query.upgrade)
      {
        if(!data.roles.includes('shop'))
          data.roles.push('shop')
        console.log(` In upgrade \n roles -> ${data.roles} `)
        await knex('shops').update({ approved: true }).where( { shop_id : id} )
      }

      let temp = await knex('users').update({ 'roles': data.roles }).where({ 'id' : id }).returning('*')
      return temp
    } )
    
    return res

  }

  async remove (id, params) {
    return { id };
  }
};
