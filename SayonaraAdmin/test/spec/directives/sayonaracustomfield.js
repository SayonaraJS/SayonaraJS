'use strict';

describe('Directive: sayonaraCustomField', function () {

  // load the directive's module
  beforeEach(module('sayonaraAdminApp'));

  var element,
    scope;

  beforeEach(inject(function ($rootScope) {
    scope = $rootScope.$new();
  }));

  it('should make hidden element visible', inject(function ($compile) {
    element = angular.element('<sayonara-custom-field></sayonara-custom-field>');
    element = $compile(element)(scope);
    expect(element.text()).toBe('this is the sayonaraCustomField directive');
  }));
});
