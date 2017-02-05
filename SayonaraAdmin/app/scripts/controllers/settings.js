'use strict';

/**
 * @ngdoc function
 * @name sayonaraAdminApp.controller:SettingsCtrl
 * @description
 * # SettingsCtrl
 * Controller of the sayonaraAdminApp
 */
angular.module('sayonaraAdminApp')
  .controller('SettingsCtrl', function ($scope, adminNotify, sayonaraEntryTypeService, sayonaraCategoryService, sayonaraAdminService) {
    this.awesomeThings = [
      'HTML5 Boilerplate',
      'AngularJS',
      'Karma'
    ];

    //Set our collapsible lists
    $scope.showList = {
      entryTypes: false,
      categories: false
    }

    //Get populated entrytypes and categories
    ////Get info for editing (Categories and Entry Types)
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

    //Create a new Entry Types
    $scope.createEntryType = function() {

      //Create our payload (With Default Entry Type)
      var payload = {
        title: 'New Sayonara Entry Type',
        order: 0,
        hasContent: true
      }

      sayonaraEntryTypeService.createEntryType(payload).then(function(success) {
        //Push to our array of entry types
        $scope.entryTypes.push(success);
        adminNotify.showAlert('Created a new Entry Type!');
      }, function(error) {
        //Pass to the error handler
        adminNotify.error(error);
      });
    }

    //Create new categories
    $scope.createCategory = function() {
      //Create our payload (With Default Entry Type)
      var payload = {
        title: 'New Sayonara Category',
        hasContent: true
      }

      sayonaraCategoryService.createCategory(payload).then(function(success) {
        //Push to our array of entry types
        $scope.categories.push(success);
        adminNotify.showAlert('Created a new Category!');
      }, function(error) {
        //Pass to the error handler
        adminNotify.error(error);
      });
    }

    //Save/Update an entryType
    $scope.saveEntryType = function(entryType) {

      //Get our payload
      var payload = Object.assign({}, entryType)

      //Delete uneeded fields from the json
      delete payload['_id'];
      delete payload['entries'];

      sayonaraEntryTypeService.updateEntryTypeById(entryType._id, payload).then(function(success) {
        //Inform of success
        adminNotify.showAlert('Saved the entry type!');
      }, function(error) {
        //Pass to the error handler
        adminNotify.error(error);
      });
    }

    //Save/Update a category
    $scope.saveCategory = function(category) {

      //Get our payload
      var payload = Object.assign({}, category)

      //Delete uneeded fields from the json
      delete payload['_id'];

      sayonaraCategoryService.updateCategoryById(category._id, payload).then(function(success) {
        //Inform of success
        adminNotify.showAlert('Saved the category!');
      }, function(error) {
        //Pass to the error handler
        adminNotify.error(error);
      });
    }

    //Delete an entryType
    $scope.deleteEntryType = function(index) {

      //Return if not a valid index
      if(!$scope.entryTypes[index] || !$scope.entryTypes[index]._id) return;

      sayonaraEntryTypeService.deleteEntryTypeById($scope.entryTypes[index]._id).then(function(success) {

        //Delete the entry type from the client
        $scope.entryTypes.splice(index, 1);


        //Inform of success
        adminNotify.showAlert('Deleted the entry type!');
      }, function(error) {
        //Pass to the error handler
        adminNotify.error(error);
      });
    }

    //Delete a categort
    $scope.deleteCategory = function(index) {

      //Return if not a valid index
      if(!$scope.categories[index] || !$scope.categories[index]._id) return;

      sayonaraCategoryService.deleteCategoryById($scope.categories[index]._id).then(function(success) {

        //Delete the category from the client
        $scope.categories.splice(index, 1);

        //Inform of success
        adminNotify.showAlert('Deleted the category!');
      }, function(error) {
        //Pass to the error handler
        adminNotify.error(error);
      });
    }
  });
