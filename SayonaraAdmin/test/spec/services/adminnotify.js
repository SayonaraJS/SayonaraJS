'use strict';

describe('Service: adminNotify', function () {

  // load the service's module
  beforeEach(module('sayonaraAdminApp'));

  // instantiate service
  var adminNotify;
  beforeEach(inject(function (_adminNotify_) {
    adminNotify = _adminNotify_;
  }));

  it('should do something', function () {
    expect(!!adminNotify).toBe(true);
  });

});
