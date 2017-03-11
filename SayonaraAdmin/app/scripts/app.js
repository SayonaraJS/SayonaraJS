'use strict';

/**
 * @ngdoc overview
 * @name sayonaraAdminApp
 * @description
 * # sayonaraAdminApp
 *
 * Main module of the application.
 */
angular
	.module('sayonaraAdminApp', [
		'ngAnimate',
		'ngCookies',
		'ngResource',
		'ngRoute',
		'ngSanitize',
		'ngMaterial',
		'angular-loading-bar',
		'ngQuill',
		'ui.codemirror',
		'sayonaraAuth',
		'sayonaraPages',
    'sayonaraEntries',
		'sayonaraEntryType',
		'sayonaraCategory',
		'sayonaraAdmin',
	])
	.config(function($routeProvider, $locationProvider,
			$mdThemingProvider, ngQuillConfigProvider) {

		//Configure our Application hash
		//this will remove the default '!'
		$locationProvider.hashPrefix('');

		//Configure the ngmaterial theme
		$mdThemingProvider.theme('default')
			.primaryPalette('indigo')
			.accentPalette('indigo')
			.warnPalette('red')
			.backgroundPalette('grey');

		//Configure our wysiwig
		//ngQuillConfigProvider.set(modules, theme,
		//  placeholder, formats, boundary, readOnly)
		// Image handler from: https://github.com/quilljs/quill/issues/863
		var toolbarOptions = [
		  ['bold', 'italic', 'underline', 'strike'],        // toggled buttons
		  ['blockquote', 'code-block'],
		  [{ 'header': 1 }, { 'header': 2 }],               // custom button values
		  [{ 'list': 'ordered'}, { 'list': 'bullet' }],
		  [{ 'script': 'sub'}, { 'script': 'super' }],      // superscript/subscript
		  [{ 'indent': '-1'}, { 'indent': '+1' }],          // outdent/indent
		  [{ 'direction': 'rtl' }],                         // text direction
		  [{ 'size': ['small', false, 'large', 'huge'] }],  // custom dropdown
		  [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
		  [{ 'color': [] }, { 'background': [] }],          // dropdown with defaults from theme
		  [{ 'font': [] }],
		  [{ 'align': [] }],
		  ['clean'],                                        // remove formatting button
			['link', 'image', 'video']
		];
		ngQuillConfigProvider.set({
        toolbar: {
          container: toolbarOptions,
          handlers: {
            image: function() {
							var range = this.quill.getSelection();
						  var value = prompt('Please enter the image URL');
							if(!value || value.length <= 0) return true;
						  this.quill.insertEmbed(range.index, 'image', value, Quill.sources.USER);
						}
          }
        },
				syntax: true
    }, null, 'Sayonara Editor');

		//Configure our markdown Editor
		//Set github markdown syntax, and syntax highlighting
		//(using the install highlightjs)
		marked.setOptions({
	    gfm: true,
	    tables: true,
			breaks: true,
	    highlight: function (code, lang) {
	      if (lang) {
	        return hljs.highlight(lang, code, true).value;
	      } else {
	        return hljs.highlightAuto(code).value;
	      }
	    }
  	});

		$routeProvider
			.when('/', {
				templateUrl: 'views/main.html',
				controller: 'MainCtrl',
				controllerAs: 'main'
			})
			.when('/login', {
				templateUrl: 'views/login.html',
				controller: 'LoginCtrl',
				controllerAs: 'login'
			})
			.when('/allpages', {
				templateUrl: 'views/allpages.html',
				controller: 'AllpagesCtrl',
				controllerAs: 'allPages'
			})
			.when('/page/edit', {
				templateUrl: 'views/pageedit.html',
				controller: 'PageeditCtrl',
				controllerAs: 'pageEdit'
			})
			.when('/allentries', {
			  templateUrl: 'views/allentries.html',
			  controller: 'AllentriesCtrl',
			  controllerAs: 'allEntries'
			})
      .when('/entry/edit', {
        templateUrl: 'views/entryedit.html',
        controller: 'EntryeditCtrl',
        controllerAs: 'entryEdit'
      })
			.when('/settings', {
			  templateUrl: 'views/settings.html',
			  controller: 'SettingsCtrl',
			  controllerAs: 'settings'
			})
		.when('/admin', {
		  templateUrl: 'views/admin.html',
		  controller: 'AdminCtrl',
		  controllerAs: 'admin'
		})
		.when('/admin/users', {
		  templateUrl: 'views/editusers.html',
		  controller: 'EditusersCtrl',
		  controllerAs: 'editusers'
		})
		.when('/admin/sayonaraconfig', {
		  templateUrl: 'views/sayonaraconfig.html',
		  controller: 'SayonaraconfigCtrl',
		  controllerAs: 'sayonaraConfig'
		})
			.otherwise({
				redirectTo: '/'
			});
	});
