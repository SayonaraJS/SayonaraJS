var module = angular.module('sayonaraApi', []);
module.service('sayonaraApiEndpoints', function($location, $resource) {

	//Get the host for the app
	var sayonaraApiHost = $location.protocol() + '://' + $location.host() + ':8000' + '/api';

	//Returns for functions we are exposing
	return {
		usersLogin: $resource(sayonaraApiHost + '/auth/login', {}, {
			post: {
				method: 'POST',
				params: {},
				isArray: false
			}
		}),
		allPages: function(customHeaders) {
			return $resource(sayonaraApiHost + '/pages/all', {}, {
				get: {
					method: 'GET',
					params: {},
					isArray: true,
					headers: customHeaders || {}
				}
			});
		}
	}
});

module.service('sayonaraApiAuth', function(sayonaraApiEndpoints) {

	//Perform actions based on our endpoints

	//Login a user
	var authLogin = function(payload) {
		//Send the request to the endpoint
		return sayonaraApiEndpoints.usersLogin.post(payload).$promise;
	}


	//Returns for functions we are exposing
	return {
		loginUser: authLogin
	}
});

module.service('sayonaraApiPages', function(sayonaraApiEndpoints) {

	//Perform actions based on our endpoints

	//Get all pages
	var getAllPages = function(headers) {
		//Send the request to the endpoint
		//Using the payload as headers
		return sayonaraApiEndpoints.allPages(headers).get().$promise;
	}


	//Returns for functions we are exposing
	return {
		getAllPages: getAllPages
	}
});
