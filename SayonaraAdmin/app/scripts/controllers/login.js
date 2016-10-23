'use strict';

/**
 * @ngdoc function
 * @name sayonaraAdminApp.controller:LoginCtrl
 * @description
 * # LoginCtrl
 * Controller of the sayonaraAdminApp
 */
angular.module('sayonaraAdminApp')
	.controller('LoginCtrl', function($scope, $location, adminNotify, sayonaraAuthService) {
		this.awesomeThings = [
			'HTML5 Boilerplate',
			'AngularJS',
			'Karma'
		];

		//Check if we are already logged in, if we are, go back home
		if (sayonaraAuthService.isLoggedIn()) $location.path('/');

		//Initialize our login form fields
		$scope.email = '';
		$scope.password = '';

		$scope.submitLogin = function() {
			//Pass the email and password to the auth service
			sayonaraAuthService.loginUser($scope.email, $scope.password).then(function(success) {
				//Success

				//Pass the JWT to the auth service to be saved
				sayonaraAuthService.saveUser(success.token);

				//Alert the user
				adminNotify.showAlert('Welcome Back!');

				//Navigate to the home page
				$location.path('/');
			}, function(error) {
				//error

				//Handle the error
				adminNotify.error(error, [{
					status: 401,
					text: "Incorrect Password."
				}, {
					status: 404,
					text: "E-mail not found."
				}])
			})
		};
	});
