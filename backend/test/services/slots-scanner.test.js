const app = require('../../src/app');

describe('\'slots-scanner\' service', () => {
  it('registered the service', () => {
    const service = app.service('slots-scanner');
    expect(service).toBeTruthy();
  });
});
