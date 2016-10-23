'use strict';

describe('Controller: AllpagesCtrl', function () {

  // load the controller's module
  beforeEach(module('sayonaraAdminApp'));

  var AllpagesCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    AllpagesCtrl = $controller('AllpagesCtrl', {
      $scope: scope
      // place here mocked dependencies
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(AllpagesCtrl.awesomeThings.length).toBe(3);
  });
});
