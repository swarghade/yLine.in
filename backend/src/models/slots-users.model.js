/* eslint-disable no-console */

// slots-users-model.js - A KnexJS
// 
// See http://knexjs.org/
// for more of what you can do here.
module.exports = function (app) {
  const db = app.get('knexClient');
  const tableName = 'slots_users';
  db.schema.hasTable(tableName).then(exists => {
    if(!exists) {
      db.schema.createTable(tableName, table => { 
        table.increments('id')
        table.integer('slot_id')
        table.integer('user_id')
        table.boolean('used').defaultsTo('false')
        table.unique(['slot_id','user_id'])
        table.foreign('slot_id').references('slots.slot_id')
        table.foreign('user_id').references('users.user_id')
        
      })
        .then(() => console.log(`Created ${tableName} table`))
        .catch(e => console.error(`Error creating ${tableName} table`, e));
    }
  });
  

  return db;
};
