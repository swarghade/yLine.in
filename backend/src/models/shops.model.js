/* eslint-disable no-console */

// shops-model.js - A KnexJS
// 
// See http://knexjs.org/
// for more of what you can do here.
module.exports = function (app) {
  const db = app.get('knexClient')
  const tableName = 'shops'
  db.schema.hasTable(tableName).then(exists => {
    if(!exists) {
      db.schema.createTable(tableName, table => {
        table.integer('shop_id').unique()
        table.foreign('shop_id').references('users.id')
        table.integer('category_id').unique()
        table.foreign('category_id').references('category.id')
        table.string('name',128)
        table.time('start_time')
        table.time('end_time')
        table.integer('interval')
        table.string('address',255)
        table.string('latitude',20)
        table.string('longitude',20)
        table.specificType('gps','geography')
        table.specificType('phone_numbers','varchar[][]').notNullable();
        table.string('state',50).notNullable();
        table.string('city',50).notNullable();
        table.integer('zip_code',6).notNullable();
        table.boolean('approved');
        table.boolean('x_deleted').defaultsTo(false)
        table.specificType('images','varchar[]').notNullable();

      })
        .then(() => console.log(`Created ${tableName} table`))
        .catch(e => console.error(`Error creating ${tableName} table`, e))
    }
  })
  

  return db
}
