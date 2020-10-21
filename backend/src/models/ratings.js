/* eslint-disable no-console */

// users-model.js - A KnexJS
// 
// See http://knexjs.org/
// for more of what you can do here.
module.exports = function (app) {
  const db = app.get('knexClient')
  const tableName = 'ratings'
  
  // CREATE TABLE ratings( id SERIAL PRIMARY KEY, su_id INTEGER REFERENCES slots_users(id), rating INTEGER CHECK (rating <= 5 AND rating >= 1 ), message VARCHAR(256) );
  // add id to slots_users

  db.schema.hasTable(tableName).then(exists => {
    if(!exists) {
      db.schema.createTable(tableName, table => {
        table.increments('id')
        table.integer('su_id')
        table.integer('shop_id')
        table.integer('rating').max(5)
        table.string('message', 256)
        table.foreign('su_id').references('slots_users.id') 
        table.foreign('shop_id').references('shops.shop_id')
      })
        .then(() => console.log(`Created ${tableName} table`))
        .catch(e => console.error(`Error creating ${tableName} table`, e))
    }
  })

  return db
}
