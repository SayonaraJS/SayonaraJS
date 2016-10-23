'use strict';

describe('Controller: PageeditCtrl', function () {

  // load the controller's module
  beforeEach(module('sayonaraAdminApp'));

  var PageeditCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    PageeditCtrl = $controller('PageeditCtrl', {
      $scope: scope
      // place here mocked dependencies
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(PageeditCtrl.awesomeThings.length).toBe(3);
  });
});
