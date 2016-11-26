/**
 * @ngdoc directive
 * @name sayonaraAdminApp.directive:navBar
 * @description
 * # navBar
 */
angular.module('sayonaraAdminApp')
	.directive('navBar', ['$location', '$mdSidenav', 'sayonaraAuthService', function($location, $mdSidenav, sayonaraAuthService) {
		return {
			templateUrl: 'views/templates/navbar.html',
			restrict: 'E',
			link: function postLink(scope, element, attrs) {

				//Function to set the current route in nav
				var setNav = function() {

					//Get the current route
					var route = $location.path();

					//Check for the correct route
					//Default to dashboard
					if (route == '/') scope.currentNavItem = 'home';
					else if (route == '/about') scope.currentNavItem = 'about';
					else if (route.includes('page')) scope.currentNavItem = 'pages';
					else if (route.includes('entry') || route.includes('allentries')) scope.currentNavItem = 'entries';
					else if (route.includes('settings')) scope.currentNavItem = 'settings';
					else scope.currentNavItem = '';
				}
				setNav();

				//Call set nav on route changes
				scope.$on("$routeChangeSuccess", function(event, current, previous) {
					setNav();
				});

				//Function to check if we are logged in
				scope.isLoggedIn = function() {
					//Simply return Sayonara's auth service
					return sayonaraAuthService.isLoggedIn('/login');
				}

				//Funtion to get user permissions
				scope.getPermissions = function() {
					//Simply return sayonara's atuh permissions
					return sayonaraAuthService.getUser();
				}

				//Function to log out
				scope.logout = function() {
					//Have the auth service logout the user
					sayonaraAuthService.logout();
				}

				//Function to set our nav toggler
				scope.toggleSideNav = buildToggler('left');

				function buildToggler(componentId) {
					return function() {
						$mdSidenav(componentId).toggle();
					}
				}

				//Function to determine if we have a collapsing navbar
				scope.isMobile = function() {

					//Check to see if the css rule for the collapsible applies
					var mq = window.matchMedia('(max-width: 767px)');

					return mq.matches;
				}
			}
		};
	}]);
