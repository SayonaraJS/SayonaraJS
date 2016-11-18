'use strict';

/**
 * @ngdoc function
 * @name sayonaraAdminApp.controller:AllentriesCtrl
 * @description
 * # AllentriesCtrl
 * Controller of the sayonaraAdminApp
 */
angular.module('sayonaraAdminApp')
  .controller('AllentriesCtrl', function ($scope, $location, adminNotify, sayonaraEntryService) {
    this.awesomeThings = [
      'HTML5 Boilerplate',
      'AngularJS',
      'Karma'
    ];

    //Get entries on page load
		$scope.pages = [];
		sayonaraEntryService.getAllEntries().then(function(success) {

			//Preety date of the the dates
			success.forEach(function(entry) {
				entry.date = moment(entry.date).fromNow();
			});
			//Set entries to success
			$scope.entries = success;

      console.log(success);
		}, function(error) {
			//Hanlde the error
			adminNotify.error(error);
		});

		//navigate to edit an entry
		$scope.goToEntry = function(id) {
			if (id) $location.path('/entry/edit').search('id', id)
			else $location.path('/entry/edit')
		}
  });
