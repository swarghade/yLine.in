/* eslint-disable no-unused-vars */
const { Forbidden, NotFound } = require('@feathersjs/errors')
const debug = require('debug')('scanner')

exports.Scanner = class Scanner {
  constructor (options) {
    this.options = options || {};
  }

  setup(app){
    this.app = app
  }

  async patch (id, data, params) {
    if( params.user && params.user.roles.includes('shop') )
    {
      let db = this.app.get('knexClient')
      debug('In patch')
      console.log('in patch')
      debug(' data -> %o \n id -> %o ',data,id)
      let res = await db.transaction( async (knex) => {

        try{
          const temp = await knex('slots')
            .join('slots_users','slots.slot_id','=','slots_users.slot_id')
            .where(
              {
                'slots_users.slot_id': Number(data.slot_id),
                'slots_users.user_id': Number(id), 
                'slots_users.used': false
              }) 
            .select( knex.raw(' (CONCAT(slots.date,\' \',slots.slot_end)::timestamp > NOW()) AS is_valid'),
              knex.raw('( CONCAT(slots.date,\' \',slots.slot_start)::timestamp <= NOW()) AS has_started')
            )

          // time constraint as well
          
          debug(' first query \n %o ', temp)

          if(temp.length == 0)
          {
            throw new NotFound(' No slot found ')
          }
          else
          {
            if(!temp[0].is_valid)
              throw new Forbidden( 'Slot expired' )
            if(!temp[0].has_started)
              throw new Forbidden('You came too early')
          }

          const secondQuery = await knex('slots_users').update({ used: true }).where({ slot_id: data.slot_id, user_id: id }).returning('*')
          return secondQuery
        }
        catch(e){
          debug(' error -> %o ', e)
          throw e
        }
        

      } )

      return res
    }
    else
      throw new Forbidden('Access denied')
  }

  async remove (id, params) {
    return { id };
  }
};
