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
    this.awesomeThings = [
      'HTML5 Boilerplate',
      'AngularJS',
      'Karma'
    ];

    //Get the sayonara config on page load
    $scope.sayonaraConfig = {};
    sayonaraAdminService.getSayonaraConfig().then(function(success) {
      //Set the config
      $scope.sayonaraConfig = success;
    }, function(error) {
      //Inform the User
      adminNotify.error(error);
    });

    //Update the config
    $scope.updateConfig = function() {

    }
  });
