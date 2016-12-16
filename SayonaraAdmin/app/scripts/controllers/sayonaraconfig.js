'use strict';

/**
 * @ngdoc function
 * @name sayonaraAdminApp.controller:SayonaraconfigCtrl
 * @description
 * # SayonaraconfigCtrl
 * Controller of the sayonaraAdminApp
 */
angular.module('sayonaraAdminApp')
  .controller('SayonaraconfigCtrl', function ($scope, adminNotify, sayonaraAdminService) {
    //Get the sayonara config on page load
    $scope.sayonaraConfig = {};
    $scope.originalSayonaraConfig = {};
    sayonaraAdminService.getSayonaraConfig().then(function(success) {
      //Set the config
      $scope.sayonaraConfig = success;
      $scope.originalSayonaraConfig = angular.copy($scope.sayonaraConfig);
    }, function(error) {
      //Inform the User
      adminNotify.error(error);
    });

    //Update the config
    $scope.updateConfig = function() {
      //Check if we made any changes
      if(angular.equals($scope.sayonaraConfig, $scope.originalSayonaraConfig)) return;

      //Create a copy to avoid the token being added to the config
      var payload = angular.copy($scope.sayonaraConfig);

      //Simply send the json as the payload
      sayonaraAdminService.updateSayonaraConfig(payload).then(function(success) {

        //Set the update config
        $scope.sayonaraConfig = success;
        $scope.originalSayonaraConfig = angular.copy($scope.sayonaraConfig);

        //Inform the user of a scucessful update, and the server should be restarting itself
        adminNotify.showAlert('Sayonara Config Updated! Plese restart Sayonara to see the changes...');
      }, function(error) {
        //Inform the user
        adminNotify.error(error);
      });
    }
  });
