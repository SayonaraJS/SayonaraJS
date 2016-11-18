'use strict';

/**
 * @ngdoc directive
 * @name sayonaraAdminApp.directive:sayonaraSelector
 * @description
 * # sayonaraSelector
 */
angular.module('sayonaraAdminApp')
  .directive('sayonaraSelector', function ($timeout) {
    return {
      templateUrl: 'views/templates/sayonaraselector.html',
      restrict: 'E',
      scope: {
				ngModel: '=',
        selections: '<',
        selectorLabel: '@',
        multipleSelection: '@',
        onSelect: '&',
			},
      link: function postLink(scope, element, attrs) {
        //Initialize our search to nothing
        scope.selectionSearch = '';

        //Call any callbacks on select
        scope.selectClosed = function() {

          //Reset our search
          scope.selectionSearch = '';
          //Timeout to call callback on next digest
          $timeout(function () {
            scope.onSelect({
              selection: scope.ngModel
            });
          }, 0);
        }
      }
    };
  });
