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
    $scope.users = [];
    $scope.showPermissions = {};
    sayonaraAuthService.getAllUsers().then(function(success) {
      $scope.users = success
		}, function(error) {
			//Hanlde the error
			adminNotify.error(error);
		});

    //Join a new user
    $scope.createUser = function() {

      //First ensure we have all the fields
      if(!$scope.newUser.email ||
        !$scope.newUser.password ||
        !$scope.newUser.confirmPassword) {
        //Say you must complete all fields
        adminNotify.showAlert('You must complete all "New User" fields');
        return;
      }

      //Next ensure the passwords match
      if($scope.newUser.password != $scope.newUser.confirmPassword) {
        //Informa the user
        adminNotify.showAlert('The Passwords do not match');
        return;
      }

      //Make the request since it is valid
      //Service will add our token
      var payload = {
        email: $scope.newUser.email,
        password: $scope.newUser.password
      }

      //Make the request
      sayonaraAuthService.createUser(payload).then(function(success) {

        //Clear the fields
        $scope.newUser = {};

        //Add the user to our users
        $scope.users.push(success);
      }, function(error) {
        //Handle the Error
        adminNotify.error(error, [{
          status: 409,
          text: 'Email Already Exists'
        }]);
      });
    }

    //Update a user
  });
