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
      $scope.originalUsers = angular.copy($scope.users);
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
        $scope.originalUsers = angular.copy($scope.users);

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
      }

      //Check if we are going to change our email
      if(user.email != $scope.originalUsers[index].email) payload.email = user.email;

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
        //The permissions changed

        //Ensure that if we cannot read, we disable everything else
        var permissionsKeys = Object.keys(user.permissions);
        //Remove the admin key
        permissionsKeys.splice(permissionsKeys.indexOf('admin'), 1);
        for(var i = 0; i < permissionsKeys.length; i++) {
          if(user.permissions[permissionsKeys[i]].read != undefined &&
              !user.permissions[permissionsKeys[i]].read) {
            user.permissions[permissionsKeys[i]].create = false;
            user.permissions[permissionsKeys[i]].update = false;
            user.permissions[permissionsKeys[i]].delete = false;
          }
        }

        //Add to the payload
        payload.permissions = user.permissions;
      }

      //Laslty, if we only have the user id, if so, dont make the request
      if(Object.keys(payload).length == 1) return;

      //Make the request with the payload
      sayonaraAuthService.updateUser(payload).then(function(success) {
        //Success!

        //Clear the user password fields
        delete $scope.users[index].confirmPassword
        delete $scope.users[index].newPassword
        delete $scope.users[index].newPasswordConfirm
        $scope.originalUsers = angular.copy($scope.users);

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

    //Delete a user
    $scope.deleteUser = function(user, index) {
      //Create our payload
      var payload = {
        id: user._id,
      }
      //Send the request
      sayonaraAuthService.deleteUser(payload).then(function(success) {
        //Remove the user from the users array
        $scope.users.splice(index, 1);
        $scope.originalUsers = angular.copy($scope.users);

        //Inform the user
        adminNotify.showAlert(user.email + " successfully deleted!");

      }, function(error) {
        //Notify the user
        adminNotify.error(error);
      });
    }
  });
