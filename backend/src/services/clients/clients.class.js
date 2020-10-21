const { Service } = require('feathers-knex')


/*const updateExample = () => {
  console.log(` Arguemnts are ${args} `)
}*/


exports.Clients = class Clients extends Service {
  constructor(options) {
    super({
      ...options,
      name: 'clients'
    })
  } 

  setup(app){
    this.app = app
  }

  async find(params) {

    let query = this.createQuery(params)
    query.join('users','clients.client_id','=','users.id')
    
    return query
  }


}


