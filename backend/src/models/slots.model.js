/* eslint-disable no-console */

// slots-model.js - A KnexJS
// 
// See http://knexjs.org/
// for more of what you can do here.
module.exports = function (app) {
  const db = app.get('knexClient')
  const tableName = 'slots'


  db.schema.hasTable(tableName).then(exists => {
    if(!exists) {
      db.schema.createTable(tableName, table => {
      
        table.increments('slot_id')
        table.integer('shop_id').notNullable()
        table.foreign('shop_id').references('shops.shop_id')
        table.date('date').notNullable()
        table.time('slot_start').notNullable()
        table.time('slot_end').notNullable()
        table.integer('limit').notNullable()
        table.string('text')
      })
        .then(() => console.log(`Created ${tableName} table`))
        .catch(e => console.error(`Error creating ${tableName} table`, e))
    }
  })


  return db
}
