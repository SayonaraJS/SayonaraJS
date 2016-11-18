'use strict';

/**
 * @ngdoc function
 * @name sayonaraAdminApp.controller:SettingsCtrl
 * @description
 * # SettingsCtrl
 * Controller of the sayonaraAdminApp
 */
angular.module('sayonaraAdminApp')
  .controller('SettingsCtrl', function ($scope, sayonaraAdminService) {
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
  });
