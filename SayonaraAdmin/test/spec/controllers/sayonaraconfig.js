'use strict';

describe('Controller: SayonaraconfigCtrl', function () {

  // load the controller's module
  beforeEach(module('sayonaraAdminApp'));

  var SayonaraconfigCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    SayonaraconfigCtrl = $controller('SayonaraconfigCtrl', {
      $scope: scope
      // place here mocked dependencies
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(SayonaraconfigCtrl.awesomeThings.length).toBe(3);
  });
});
