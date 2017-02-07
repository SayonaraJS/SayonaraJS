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
				scope.markdown = '';

				//Function to convert out html in scope.ngModel to Markdown
				scope.htmlToMarkdown = function() {
					//Convert Html back to markdown, custom to match our needs
					//See: https://github.com/domchristie/to-markdown
					scope.markdown = toMarkdown(scope.ngModel, {
						gfm: true,
						converters: [
							{
								filter: 'code',
								replacement: function(content) {
									return '````\n' + content + '\n````';
								}
							},
							{
								filter: function(node) {
									// Filter to match the non-bindable code span
									// check if it is a span, with the ng-non-bindable
									if(node.nodeName && node.hasAttribute('ng-non-bindable')) {
										return true
									}
									return false;
								},
								replacement: function(innerHtml, node) {
									if(innerHtml.length == 0) {
										return '````\n' + innerHtml + '````';
									}
									return '`' + innerHtml.substring(0, innerHtml.length - 5) + '\n````';
								}
							}
						]
					});
				}

				//Function to convert the markdown in our text area to html
				scope.markdownToHtml = function() {
					scope.ngModel = marked(scope.markdown)
				}
			}
		};
	});
