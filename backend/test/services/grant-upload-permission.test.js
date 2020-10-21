const app = require('../../src/app');

describe('\'grantUploadPermission\' service', () => {
  it('registered the service', () => {
    const service = app.service('grant-upload-permission');
    expect(service).toBeTruthy();
  });
});
