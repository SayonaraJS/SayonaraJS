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
    $scope.originalUsers = [];
    $scope.showPermissions = {};
    sayonaraAuthService.getAllUsers().then(function(success) {
      $scope.users = success
      $scope.originalUsers = $scope.users;
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
        $scope.users.push(success.user);

        //Inform the user
        adminNotify.showAlert("User Created: " + success.user);
      }, function(error) {
        //Handle the Error
        adminNotify.error(error, [{
          status: 409,
          text: 'Email Already Exists'
        }]);
      });
    }

    //Update a user
    $scope.updateUser = function(user, index) {

      //Create our payload
      var payload = {
        id: user._id,
        email: user.email
      }

      //Check if we would like to change our password
      if(user.currentPassword &&
        user.newPassword &&
        user.newPasswordConfirm) {
        //Ensure the two passwords match
        if(user.newPassword != user.newPasswordConfirm) {
          adminNotify.showAlert('New passwords do not match!');
        }

        //Add our passwords to the payload
        payload.password = user.currentPassword;
        payload.newPassword = user.newPassword;
      }

      //Check if we changed our permissions
      if(!angular.equals(user.permissions, $scope.originalUsers[index].permissions)) {
        //The permissions changed, add to the payload
        payload.permissions = user.permissions;
      }

      //Make the request with the payload
      sayonaraAuthService.updateUser(payload).then(function(success) {
        //Success!

        //Clear the user password fields
        $scope.users[index].confirmPassword = '';
        $scope.users[index].newPassword = '';
        $scope.users[index].newPasswordConfirm = '';


        //Inform the user
        adminNotify.showAlert("User successfully updated!");
      }, function(error) {
        //Handle the Error
        adminNotify.error(error, [{
          status: 409,
          text: 'Email already taken by another user'
        }, {
          status: 403,
          text: 'Incorrect Password'
        }]);
      });
    }
  });
