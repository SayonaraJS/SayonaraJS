'use strict';

/**
 * @ngdoc function
 * @name sayonaraAdminApp.controller:AllentriesCtrl
 * @description
 * # AllentriesCtrl
 * Controller of the sayonaraAdminApp
 */
angular.module('sayonaraAdminApp')
  .controller('AllentriesCtrl', function ($scope, $location, adminNotify, sayonaraEntryTypeService) {
    this.awesomeThings = [
      'HTML5 Boilerplate',
      'AngularJS',
      'Karma'
    ];

    //Get entries on page load
		$scope.entryTypes = [];
    //Pass in true to include Entrytype's entries
		sayonaraEntryTypeService.getAllEntryTypes(true).then(function(success) {
			//Preety date of the the dates
			success.forEach(function(entryType) {
        entryType.entries.forEach(function(entry) {
          entry.date = moment(entry.date).fromNow();
        })
			});
			//Set entryTypes to success
			$scope.entryTypes = success;
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
