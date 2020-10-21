const app = require('../../src/app');

describe('\'errorlog4245\' service', () => {
  it('registered the service', () => {
    const service = app.service('errorlog-4245');
    expect(service).toBeTruthy();
  });
});
