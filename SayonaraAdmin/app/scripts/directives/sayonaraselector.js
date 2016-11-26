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
				selectedItems: '=',
        options: '<',
        selectorLabel: '@',
        multipleSelection: '<?',
        onSelect: '&?',
			},
      link: function($scope, element, attrs) {

        //Initialize our search to nothing
        $scope.selectionSearch = '';

        //Called whenever an item is chosen
        $scope.itemClicked = function(selection) {

          //Reset our search if not multiple
          if(!$scope.multipleSelection) $scope.selectionSearch = '';

          //Timeout to call callback on next digest
          $timeout(function () {

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
