'use strict';

describe('Controller: EntryeditCtrl', function () {

  // load the controller's module
  beforeEach(module('sayonaraAdminApp'));

  var EntryeditCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    EntryeditCtrl = $controller('EntryeditCtrl', {
      $scope: scope
      // place here mocked dependencies
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(EntryeditCtrl.awesomeThings.length).toBe(3);
  });
});
