'use strict';

/**
 * @ngdoc function
 * @name sayonaraAdminApp.controller:AllpagesCtrl
 * @description
 * # AllpagesCtrl
 * Controller of the sayonaraAdminApp
 */
angular.module('sayonaraAdminApp')
	.controller('AllpagesCtrl', function($scope, sayonaraPageService) {
		this.awesomeThings = [
			'HTML5 Boilerplate',
			'AngularJS',
			'Karma'
		];

		sayonaraPageService.getAllPages().then(function(success) {
			console.log(success);
		}, function(error) {

		});
	});
