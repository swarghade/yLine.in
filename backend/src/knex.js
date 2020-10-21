const knex = require('knex')
const knexPostgis = require('knex-postgis')


module.exports = function (app) {
  const { client, connection } = app.get('postgres')
  const db = knex({ client, connection })
  let postgis = knexPostgis(db)

  app.set('knexClient', db)
  app.set('postgis',postgis)

  
}
