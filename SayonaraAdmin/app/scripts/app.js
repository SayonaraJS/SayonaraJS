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
		'ngMaterial',
		'angular-loading-bar',
		'textAngular',
		'sayonaraAuth',
		'sayonaraPages',
    'sayonaraEntries',
		'sayonaraEntryType',
		'sayonaraAdmin',
	])
	.config(function($routeProvider, $mdThemingProvider) {

		//Configure the ngmaterial theme
		$mdThemingProvider.theme('default')
			.primaryPalette('indigo')
			.accentPalette('indigo')
			.warnPalette('red')
			.backgroundPalette('grey');

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
			.when('/allpages', {
				templateUrl: 'views/allpages.html',
				controller: 'AllpagesCtrl',
				controllerAs: 'allPages'
			})
			.when('/page/edit', {
				templateUrl: 'views/pageedit.html',
				controller: 'PageeditCtrl',
				controllerAs: 'pageEdit'
			})
			.when('/allentries', {
			  templateUrl: 'views/allentries.html',
			  controller: 'AllentriesCtrl',
			  controllerAs: 'allEntries'
			})
      .when('/entry/edit', {
        templateUrl: 'views/entryedit.html',
        controller: 'EntryeditCtrl',
        controllerAs: 'entryEdit'
      })
			.otherwise({
				redirectTo: '/'
			});
	});
