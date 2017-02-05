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
		'ngQuill',
		'sayonaraAuth',
		'sayonaraPages',
    'sayonaraEntries',
		'sayonaraEntryType',
		'sayonaraCategory',
		'sayonaraAdmin',
	])
	.config(function($routeProvider, $locationProvider,
			$mdThemingProvider, ngQuillConfigProvider) {

		//Configure our Application hash
		//this will remove the default '!'
		$locationProvider.hashPrefix('');

		//Configure the ngmaterial theme
		$mdThemingProvider.theme('default')
			.primaryPalette('indigo')
			.accentPalette('indigo')
			.warnPalette('red')
			.backgroundPalette('grey');

		//Configure our wysiwig
		ngQuillConfigProvider.set(null, null, 'custom placeholder');

		$routeProvider
			.when('/', {
				templateUrl: 'views/main.html',
				controller: 'MainCtrl',
				controllerAs: 'main'
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
			.when('/settings', {
			  templateUrl: 'views/settings.html',
			  controller: 'SettingsCtrl',
			  controllerAs: 'settings'
			})
		.when('/admin', {
		  templateUrl: 'views/admin.html',
		  controller: 'AdminCtrl',
		  controllerAs: 'admin'
		})
		.when('/admin/users', {
		  templateUrl: 'views/editusers.html',
		  controller: 'EditusersCtrl',
		  controllerAs: 'editusers'
		})
		.when('/admin/sayonaraconfig', {
		  templateUrl: 'views/sayonaraconfig.html',
		  controller: 'SayonaraconfigCtrl',
		  controllerAs: 'sayonaraConfig'
		})
			.otherwise({
				redirectTo: '/'
			});
	});
