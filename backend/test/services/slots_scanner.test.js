const app = require('../../src/app');

describe('\'slots_scanner\' service', () => {
  it('registered the service', () => {
    const service = app.service('slots-scanner');
    expect(service).toBeTruthy();
  });
});
