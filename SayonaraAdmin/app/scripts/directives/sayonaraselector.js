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
        multipleSelection: '<?',
        onSelect: '&?',
			},
      link: function($scope, element, attrs) {

        //Initialize our search to nothing
        $scope.selectionSearch = '';

        //Call function once directive compiles, to workaround md-select
        $timeout(function () {
          $scope.selectedItems = $scope.ngModel;
        }, 0);

        //Called whenever an item is chosen
        $scope.itemClicked = function(selection) {

          //Reset our search if not multiple
          if(!$scope.multipleSelection) $scope.selectionSearch = '';

          //Timeout to call callback on next digest
          $timeout(function () {

            //Set our ngModel to our selectedItems
            $scope.ngModel = $scope.selectedItems;

            //Check if we have an onselect callback
            if(!$scope.onSelect) return;
            $scope.onSelect({
              selection: selection
            });
          }, 0);
        }
      }
    };
  });
