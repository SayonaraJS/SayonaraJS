'use strict';

/**
 * @ngdoc directive
 * @name sayonaraAdminApp.directive:entryFieldContent
 * @description
 * # entryFieldContent
 */
angular.module('sayonaraAdminApp')
	.directive('sayonaraContent', function($showdown) {
		return {
			templateUrl: 'views/templates/sayonaracontent.html',
			restrict: 'E',
			scope: {
				ngModel: '='
			},
			link: function postLink(scope, element, attrs) {
				//Do some logic here
				scope.markdown = ''
				scope.$watch('ngModel', function (newValue) {
            if(scope.ngModel && scope.ngModel.length > 0 && scope.markdown.length < 1)
							scope.markdown = toMarkdown(scope.ngModel);
        });

				scope.markdownToHtml = function() {
					console.log('bye')
					scope.ngModel = $showdown.makeHtml(scope.markdown)
				}
			}
		};
	});
