'use strict';

/**
 * @ngdoc directive
 * @name sayonaraAdminApp.directive:entryFieldContent
 * @description
 * # entryFieldContent
 */
angular.module('sayonaraAdminApp')
	.directive('sayonaraContent', function() {
		return {
			templateUrl: 'views/templates/sayonaracontent.html',
			restrict: 'E',
			scope: {
				ngModel: '='
			},
			link: function postLink(scope, element, attrs) {
				//Do some logic here
				//Initialize some variables
				scope.markdown = '';
				scope.markdownCodeEditorOptions = {
		      lineWrapping : true,
		      lineNumbers: true,
		      mode: 'gfm',
		    };
				scope.htmlCodeEditorOptions = {
		      lineWrapping : true,
		      lineNumbers: true,
		      mode: 'text/html',
		    };

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

					//Our temporary holding place for our markdown
					var inputMarkdown = scope.markdown;

					//Replace all occurances
					inputMarkdown = inputMarkdown.replace(/(?:\r\n|\r|\n)/g, '<br>\n');

					//Override marked to respect br
					// https://github.com/chjj/marked/issues/504
					marked.prototype.constructor.Parser.prototype.parse = function (src) {
					    this.inline = new marked.InlineLexer(src.links, this.options, this.renderer);
					    this.inline.rules.br = { exec: function() {} }
					    this.tokens = src.reverse();
					    var out = '';
					    while (this.next()) {
					        out += this.tok();
					    }
					    return out;
					};

					//Convert to HTML
					console.log(inputMarkdown);
					scope.ngModel = marked(inputMarkdown);
				}
			}
		};
	});
