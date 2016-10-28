'use strict';

describe('Controller: AllentriesCtrl', function () {

  // load the controller's module
  beforeEach(module('sayonaraAdminApp'));

  var AllentriesCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    AllentriesCtrl = $controller('AllentriesCtrl', {
      $scope: scope
      // place here mocked dependencies
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(AllentriesCtrl.awesomeThings.length).toBe(3);
  });
});
