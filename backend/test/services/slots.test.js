const app = require('../../src/app')

describe('\'slots\' service', () => {
  it('registered the service', () => {
    const service = app.service('slots')
    expect(service).toBeTruthy()
  })

  

})
