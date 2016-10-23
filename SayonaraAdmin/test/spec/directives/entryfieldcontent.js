'use strict';

describe('Directive: entryFieldContent', function () {

  // load the directive's module
  beforeEach(module('sayonaraAdminApp'));

  var element,
    scope;

  beforeEach(inject(function ($rootScope) {
    scope = $rootScope.$new();
  }));

  it('should make hidden element visible', inject(function ($compile) {
    element = angular.element('<entry-field-content></entry-field-content>');
    element = $compile(element)(scope);
    expect(element.text()).toBe('this is the entryFieldContent directive');
  }));
});
