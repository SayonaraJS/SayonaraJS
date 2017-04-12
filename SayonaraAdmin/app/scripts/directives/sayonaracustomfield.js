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
        $scope.getFieldInputs = function(customFieldTypeId) {
          // Find our key
          var customField = $scope.getCustomFieldByTypeId(customFieldTypeId);
          if(!customField) {
            return new Array(1);
          }
          //Else return the length of the fields
          return new Array(customField
            .fields.length + 1);
        }

        // Function to find a custom field by its id
        $scope.getCustomFieldByTypeId = function(customFieldTypeId) {
          var response = false;
          $scope.customFields.some(function(customField, index) {
            if(customField.customFieldType == customFieldTypeId) {
              // return the key for the custom field type
              response = $scope.customFields[index];
              return true;
            }
            return false;
          });
          // Return our response
          return response;
        }
      }
    };
  });
