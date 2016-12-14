'use strict';

describe('Controller: EditusersCtrl', function () {

  // load the controller's module
  beforeEach(module('sayonaraAdminApp'));

  var EditusersCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    EditusersCtrl = $controller('EditusersCtrl', {
      $scope: scope
      // place here mocked dependencies
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(EditusersCtrl.awesomeThings.length).toBe(3);
  });
});
