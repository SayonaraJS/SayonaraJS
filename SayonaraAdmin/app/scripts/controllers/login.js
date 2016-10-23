'use strict';

/**
 * @ngdoc function
 * @name sayonaraAdminApp.controller:LoginCtrl
 * @description
 * # LoginCtrl
 * Controller of the sayonaraAdminApp
 */
angular.module('sayonaraAdminApp')
	.controller('LoginCtrl', function($scope, sayonaraAuthService) {
		this.awesomeThings = [
			'HTML5 Boilerplate',
			'AngularJS',
			'Karma'
		];

		//Initialize our login form fields
		$scope.email = '';
		$scope.password = '';

		$scope.submitLogin = function() {
			//Pass the email and password to the auth service
			sayonaraAuthService.loginUser($scope.email, $scope.password).then(function(success) {
				//success
				console.log(success);
			}, function(error) {
				//error
			})
		};
	});
