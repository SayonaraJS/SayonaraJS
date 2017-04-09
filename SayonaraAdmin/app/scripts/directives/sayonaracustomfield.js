'use strict';

/**
 * @ngdoc directive
 * @name sayonaraAdminApp.directive:sayonaraCustomField
 * @description
 * # sayonaraCustomField
 */
angular.module('sayonaraAdminApp')
  .directive('sayonaraCustomField', function () {
    return {
      templateUrl: 'views/templates/sayonaracustomfield.html',
      restrict: 'E',
      scope: {
				customFields: '=',
        customFieldTypes: '<',
			},
      link: function postLink($scope, element, attrs) {
        // function to return one more item than our array length
        $scope.getFields = function() {
          return new Array($scope.customFields.length + 1);
        }

        // Function to remove or add extra elements as they are filled out
        $scope.onFieldChange = function() {
          if (!$scope.customFields[$scope.customFields.length - 1]) {
            $scope.customFields.pop();
          }
        }
      }
    };
  });
