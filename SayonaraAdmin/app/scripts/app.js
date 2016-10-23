'use strict';

/**
 * @ngdoc overview
 * @name sayonaraAdminApp
 * @description
 * # sayonaraAdminApp
 *
 * Main module of the application.
 */
angular
	.module('sayonaraAdminApp', [
		'ngAnimate',
		'ngCookies',
		'ngResource',
		'ngRoute',
		'ngSanitize',
		'ngTouch',
		'ngMaterial',
		'sayonaraAuth'
	])
	.config(function($routeProvider) {
		$routeProvider
			.when('/', {
				templateUrl: 'views/main.html',
				controller: 'MainCtrl',
				controllerAs: 'main'
			})
			.when('/about', {
				templateUrl: 'views/about.html',
				controller: 'AboutCtrl',
				controllerAs: 'about'
			})
			.when('/login', {
				templateUrl: 'views/login.html',
				controller: 'LoginCtrl',
				controllerAs: 'login'
			})
			.otherwise({
				redirectTo: '/'
			});
	});
