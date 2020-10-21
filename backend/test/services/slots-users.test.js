const app = require('../../src/app');

describe('\'slots-users\' service', () => {
  it('registered the service', () => {
    const service = app.service('slots-users');
    expect(service).toBeTruthy();
  });
});
