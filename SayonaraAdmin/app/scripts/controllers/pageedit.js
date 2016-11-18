'use strict';

/**
 * @ngdoc function
 * @name sayonaraAdminApp.controller:PageeditCtrl
 * @description
 * # PageeditCtrl
 * Controller of the sayonaraAdminApp
 */
angular.module('sayonaraAdminApp')
	.controller('PageeditCtrl', function($scope, $routeParams, $location, adminNotify, sayonaraPageService, sayonaraAdminService) {
		this.awesomeThings = [
			'HTML5 Boilerplate',
			'AngularJS',
			'Karma'
		];

		//Initialize scope
		$scope.page = {};

		//Check if there is an id
		if ($routeParams.id) {
			//Save our route param
			$scope.urlId = $routeParams.id

			//Query the database for the page
			sayonaraPageService.getPageById($routeParams.id).then(function(success) {
				//Add success to scope
				$scope.page = success;
			}, function(error) {
				//Pass to te error handler
				adminNotify.error(error);
			});
		} else {
			//Add a default title to our new page
			$scope.page.title = 'New Sayonara Page'
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

		//Save the page
		$scope.savePage = function() {
			//First check if we are updating, or creating a new page
			if ($routeParams.id) updatePage($routeParams.id);
			else createPage();
		}

		var updatePage = function(id) {

			//Create our request
			var request = {
				title: $scope.page.title,
				content: $scope.page.content,
        entryTypes: $scope.page.entryTypes
			};

			//Update an existing page
			sayonaraPageService.updatePageById(id, request).then(function(success) {
				//Notify the user
				adminNotify.showAlert('Page Updated Successfully!');
			}, function(error) {
				//Pass to te error handler
				adminNotify.error(error);
			})
		}

		var createPage = function() {
			//Create a new page

			//Create our request
			var request = {
				title: $scope.page.title,
				content: $scope.page.content,
        entryTypes: $scope.page.entryTypes || []
			};

			//Update an existing page
			sayonaraPageService.createPage(request).then(function(success) {
				//Notify the user
				adminNotify.showAlert('Page Created Successfully!');
				//Navigate to the correct query param
				$location.path('/allpages');
			}, function(error) {
				//Pass to te error handler
				adminNotify.error(error);
			})
		}

		$scope.deletePage = function() {
			//Simply delete the page
			sayonaraPageService.deletePageById($routeParams.id).then(function(success) {
				//Notify the user
				adminNotify.showAlert('Page Deleted Successfully!');
				//Navigate to the correct query param
				$location.path('/allpages');
			}, function(error) {
				//Pass to te error handler
				adminNotify.error(error);
			})
		}
	});
