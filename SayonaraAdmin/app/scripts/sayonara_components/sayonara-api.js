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
		newPage: function(customHeaders) {
			return $resource(sayonaraApiHost + '/pages/create', {}, {
				post: {
					method: 'POST',
					params: {},
					isArray: false,
					headers: customHeaders || {}
				}
			});
		},
		allPages: function(customHeaders) {
			return $resource(sayonaraApiHost + '/pages/all', {}, {
				get: {
					method: 'GET',
					params: {},
					isArray: true,
					headers: customHeaders || {}
				}
			});
		},
		pageById: function(customHeaders) {
			return $resource(sayonaraApiHost + '/pages/id/:id', {}, {
				get: {
					method: 'GET',
					params: {
						id: '@id'
					},
					isArray: false,
					headers: customHeaders || {}
				},
				update: {
					method: 'PUT',
					params: {
						id: '@id'
					},
					isArray: false,
					headers: customHeaders || {}
				},
				delete: {
					method: 'DELETE',
					params: {
						id: '@id'
					},
					isArray: false,
					headers: customHeaders || {}
				}
			});
		},
		newEntry: function(customHeaders) {
			return $resource(sayonaraApiHost + '/entry/create', {}, {
				post: {
					method: 'POST',
					params: {},
					isArray: false,
					headers: customHeaders || {}
				}
			});
		},
		entryById: function(customHeaders) {
			return $resource(sayonaraApiHost + '/entry/id/:id', {}, {
				get: {
					method: 'GET',
					params: {
						id: '@id'
					},
					isArray: false,
					headers: customHeaders || {}
				},
				update: {
					method: 'PUT',
					params: {
						id: '@id'
					},
					isArray: false,
					headers: customHeaders || {}
				},
				delete: {
					method: 'DELETE',
					params: {
						id: '@id'
					},
					isArray: false,
					headers: customHeaders || {}
				}
			});
		},
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

	//Get a page from id
	var getPageById = function(headers) {

		//Grab the id
		var pageId = {
			id: headers.id
		}

		//Send the request to the endpoint
		//Using the payload as headers
		return sayonaraApiEndpoints.pageById(headers).get(pageId).$promise;
	}

	//Create a new page
	var createPage = function(payload) {
		//Send the request to the endpoint
		return sayonaraApiEndpoints.newPage().post(payload).$promise;
	}

	//Update a page from id
	var updatePageById = function(payload) {
		//Send the request to the endpoint
		return sayonaraApiEndpoints.pageById().update(payload).$promise;
	}

	//delete a page from id
	var deletePageById = function(payload) {
		//Send the request to the endpoint
		return sayonaraApiEndpoints.pageById().delete(payload).$promise;
	}


	//Returns for functions we are exposing
	return {
		getAllPages: getAllPages,
		getPageById: getPageById,
		createPage: createPage,
		updatePageById: updatePageById,
		deletePageById: deletePageById
	}
});

module.service('sayonaraApiEntries', function(sayonaraApiEndpoints) {

	//Perform actions based on our endpoints

	//Create a new entry
	var createEntry = function(payload) {
		//Send the request to the endpoint
		return sayonaraApiEntries.newEntry().post(payload).$promise;
	}


	//Returns for functions we are exposing
	return {
		createPage: createPage
	}
});
