'use strict';

/**
 * @ngdoc function
 * @name sayonaraAdminApp.controller:EntryeditCtrl
 * @description
 * # EntryeditCtrl
 * Controller of the sayonaraAdminApp
 */
angular.module('sayonaraAdminApp')
  .controller('EntryeditCtrl', function ($scope, $routeParams, $location, adminNotify, sayonaraEntryService, sayonaraAdminService) {
    this.awesomeThings = [
      'HTML5 Boilerplate',
      'AngularJS',
      'Karma'
    ];

    //Initialize scope
		$scope.entry = {};

		//Check if there is an id
		if ($routeParams.id) {
			//Save our route param
			$scope.urlId = $routeParams.id

			//Query the database for the page
			sayonaraEntryService.getEntryById($routeParams.id).then(function(success) {
				//Add success to scope
				$scope.entry = success;
			}, function(error) {
				//Pass to te error handler
				adminNotify.error(error);
			});
		} else {
			//Add a default title to our new page
			$scope.entry.title = 'New Sayonara Entry'
		}

    //Get info for editing (Categories and Entry Types)
    $scope.entryTypes = [];
    $scope.categories = [];
    sayonaraAdminService.getSettings().then(function(success) {

      //Set our entry types and categories
      $scope.entryTypes = success.entryTypes;
      $scope.categories = success.categories;
    }, function(error) {
      //Pass to te error handler
      adminNotify.error(error);
    });

		//Save the entry
		$scope.saveEntry = function() {
			//First check if we are updating, or creating a new page
			if ($routeParams.id) updateEntry($routeParams.id);
			else createEntry();
		}

		var updateEntry = function(id) {

			//Create our request
			var request = {
				title: $scope.entry.title,
				content: $scope.entry.content,
        entryType: $scope.entry.entryType
			};

			//Update an existing page
			sayonaraEntryService.updateEntryById(id, request).then(function(success) {
				//Notify the user
				adminNotify.showAlert('Entry Updated Successfully!');
			}, function(error) {
				//Pass to te error handler
				adminNotify.error(error);
			})
		}

		var createEntry  = function() {
			//Create a new entry

			//Create our request
			var request = {
				title: $scope.entry.title,
				content: $scope.entry.content,
        entryType: $scope.entry.entryType
			};

			//Update an existing page
			sayonaraEntryService.createEntry(request).then(function(success) {
				//Notify the user
				adminNotify.showAlert('Entry Created Successfully!');
				//Navigate to the correct query param
				$location.path('/allentries');
			}, function(error) {
				//Pass to te error handler
				adminNotify.error(error);
			})
		}

		$scope.deleteEntry = function() {
			//Simply delete the page
			sayonaraEntryService.deleteEntryById($routeParams.id).then(function(success) {
				//Notify the user
				adminNotify.showAlert('Entry Deleted Successfully!');
				//Navigate to the correct query param
				$location.path('/allentries');
			}, function(error) {
				//Pass to te error handler
				adminNotify.error(error);
			})
		}
  });
