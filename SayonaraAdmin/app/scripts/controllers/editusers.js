'use strict';

/**
 * @ngdoc function
 * @name sayonaraAdminApp.controller:EditusersCtrl
 * @description
 * # EditusersCtrl
 * Controller of the sayonaraAdminApp
 */
angular.module('sayonaraAdminApp')
  .controller('EditusersCtrl', function ($scope, adminNotify, sayonaraAuthService) {
    this.awesomeThings = [
      'HTML5 Boilerplate',
      'AngularJS',
      'Karma'
    ];

    //Initialize our new users
    $scope.newUser = {};

    //Get all users on load
    $scope.users = {};
    sayonaraAuthService.getAllUsers().then(function(success) {
      $scope.users = success
		}, function(error) {
			//Hanlde the error
			adminNotify.error(error);
		});
  });
