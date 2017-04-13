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

        // Function to create or delete the fields attribute if empty
        $scope.createDeleteFieldIfEmpty = function(customFieldTypeId, event) {

          //Only accept character and number keys
          // Inner If check for backspace
          if(event.key &&
            event.keyCode < 48 ||
            (event.keyCode > 90 &&
            event.keyCode < 96) ||
            event.keyCode > 105) {
            // Return if the key is not backspace
            if(event.keyCode != 8) {
              return;
            }
          }

          // Get the custom field if it exists
          var customField = $scope.getCustomFieldByTypeId(customFieldTypeId);
          if(!customField && event.keyCode != 8) {
            $scope.customFields.push({
              customFieldType: customFieldTypeId,
              fields: []
            });
          } else if(customField.fields &&
            customField.fields.length > 1 &&
            customField.fields[customField.fields.length - 1].length <= 1 &&
            event.keyCode == 8) {
            // Splice from the array
            customField.fields.pop();
          } else if (customField.fields &&
            customField.fields.length == 1 &&
            customField.fields[0].length <= 1 &&
            event.keyCode == 8) {
            // Remove the custom field
            $scope.customFields.some(function(customField, index) {
              if(customField.customFieldType == customFieldTypeId) {
                // return the key for the custom field type
                $scope.customFields.splice(index, 1);
                return true;
              }
              return false;
            });
          }
        }
      }
    };
  });
