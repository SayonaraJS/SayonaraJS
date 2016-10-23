'use strict';

/**
 * @ngdoc directive
 * @name sayonaraAdminApp.directive:entryFieldContent
 * @description
 * # entryFieldContent
 */
angular.module('sayonaraAdminApp')
	.directive('entryFieldContent', function() {
		return {
			templateUrl: 'admin/views/templates/entryfieldcontent.html',
			restrict: 'E',
			restrict: 'E',
			scope: {
				ngModel: '='
			},
			link: function postLink(scope, element, attrs) {

				//Do some logic here

			}
		};
	});
