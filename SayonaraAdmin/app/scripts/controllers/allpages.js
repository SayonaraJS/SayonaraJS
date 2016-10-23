'use strict';

/**
 * @ngdoc function
 * @name sayonaraAdminApp.controller:AllpagesCtrl
 * @description
 * # AllpagesCtrl
 * Controller of the sayonaraAdminApp
 */
angular.module('sayonaraAdminApp')
	.controller('AllpagesCtrl', function($scope, adminNotify, sayonaraPageService) {
		this.awesomeThings = [
			'HTML5 Boilerplate',
			'AngularJS',
			'Karma'
		];

		//Get pages on page load
		$scope.pages = [];
		sayonaraPageService.getAllPages().then(function(success) {

			//Preety date of the the dates
			success.forEach(function(page) {
				page.date = moment(page.date).fromNow();
			});
			//Set pages to success
			$scope.pages = success;
		}, function(error) {
			//Hanlde the error
			adminNotify.error(error);
		});
	});
