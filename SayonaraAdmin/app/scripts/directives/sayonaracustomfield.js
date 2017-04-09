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
        //Set our custom field type to the custom field type
        $scope.editCustomFields = Object.assign({}, $scope.customFields);

        // function to return one more item than our array length
        $scope.getFields = function(customFieldTypeIndex) {
          if(!$scope.customFields[customFieldTypeIndex]) {
            return new Array(1);
          }
          //Else return the length of the fields
          return new Array($scope.customFields[customFieldTypeIndex]
            .fields.length + 1);
        }

        // Function to remove or add extra elements as they are filled out
        $scope.onFieldChange = function(customFieldTypeIndex, fieldIndex) {
          // Check if the field is null
          if(!$scope.editCustomFields[customFieldTypeIndex].fields[fieldIndex]) {
            //Remove the field if emptied
            $scope.customFields[customFieldTypeIndex].fields.splice(fieldIndex, 1);
            delete $scope.editCustomFields[customFieldTypeIndex].fields[fieldIndex];

            // Check if we have anymore fields
            if ($scope.customFields[customFieldTypeIndex].fields.length <= 0) {
              delete $scope.customFields[customFieldTypeIndex];
              delete $scope.editCustomFields[customFieldTypeIndex];
            }
          } else {
            // Create the object if it does not exist
            if(!$scope.customFields[customFieldTypeIndex]) {
              $scope.customFields[customFieldTypeIndex] = {
                customFieldType: '',
                fields: []
              };
            }
            //Set the custom field type
            $scope.customFields[customFieldTypeIndex].customFieldType =
              $scope.customFieldTypes[customFieldTypeIndex];
            // And grab our array representation of the fields
            $scope.customFields[customFieldTypeIndex].fields = [];
            for(var i = 0; i < Object.keys($scope.editCustomFields[customFieldTypeIndex]
              .fields).length; i++) {
                $scope.customFields[customFieldTypeIndex]
                .fields.push($scope.editCustomFields[customFieldTypeIndex]
                  .fields[i]);
            }
          }
        }
      }
    };
  });
