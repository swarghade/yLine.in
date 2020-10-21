const app = require('../../src/app');

describe('\'1errorlog4245\' service', () => {
  it('registered the service', () => {
    const service = app.service('1-errorlog-4245');
    expect(service).toBeTruthy();
  });
});
