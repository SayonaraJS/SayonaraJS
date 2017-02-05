'use strict';

/**
 * @ngdoc directive
 * @name sayonaraAdminApp.directive:entryFieldContent
 * @description
 * # entryFieldContent
 */
angular.module('sayonaraAdminApp')
	.directive('sayonaraContent', function(marked) {
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
            if(scope.ngModel && scope.ngModel.length > 0)
							scope.markdown = toMarkdown(scope.ngModel, {
								gfm: true
							});
        });

				scope.markdownToHtml = function() {
					scope.ngModel = marked(scope.markdown)
				}
			}
		};
	});
