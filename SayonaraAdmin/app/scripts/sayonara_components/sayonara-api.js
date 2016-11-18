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
		newContent: function(contentType, customHeaders) {
			return $resource(sayonaraApiHost + '/' + contentType + '/create', {}, {
				post: {
					method: 'POST',
					params: {},
					isArray: false,
					headers: customHeaders || {}
				}
			});
		},
		allContent: function(contentType, customHeaders) {
			return $resource(sayonaraApiHost + '/' + contentType + '/all', {}, {
				get: {
					method: 'GET',
					params: {},
					isArray: true,
					headers: customHeaders || {}
				}
			});
		},
		contentById: function(contentType, customHeaders) {
			return $resource(sayonaraApiHost + '/' + contentType + '/id/:id', {}, {
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
		editInfo: function(customHeaders) {
			return $resource(sayonaraApiHost + '/admin/editinfo', {}, {
				get: {
					method: 'GET',
					params: {},
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

module.service('sayonaraApiContent', function(sayonaraApiEndpoints) {

	//Perform actions based on our endpoints

  //Define out content type urls
  var pageContentUrl = 'pages';
  var entryContentUrl = 'entry';
  var entryTypeContentUrl = 'type';

	/**
	 *
	 *	PAGES
	 *
	 */

	//Create a new page
	var createPage = function(payload) {
		//Send the request to the endpoint
		return sayonaraApiEndpoints.newContent(pageContentUrl).post(payload).$promise;
	}

	//Get all pages
	var getAllPages = function(headers) {
		//Send the request to the endpoint
		//Using the payload as headers
		return sayonaraApiEndpoints.allContent(pageContentUrl, headers).get().$promise;
	}

	//Get a page from id
	var getPageById = function(headers) {

		//Grab the id
		var pageId = {
			id: headers.id
		}

		//Send the request to the endpoint
		//Using the payload as headers
		return sayonaraApiEndpoints.contentById(pageContentUrl, headers).get(pageId).$promise;
	}

	//Update a page from id
	var updatePageById = function(payload) {
		//Send the request to the endpoint
		return sayonaraApiEndpoints.contentById(pageContentUrl).update(payload).$promise;
	}

	//delete a page from id
	var deletePageById = function(payload) {
		//Send the request to the endpoint
		return sayonaraApiEndpoints.contentById(pageContentUrl).delete(payload).$promise;
	}

	/**
	 *
	 *	ENTRIES
	 *
	 */

  //Create a new entry
  var createEntry = function(payload) {
    //Send the request to the endpoint
    return sayonaraApiEndpoints.newContent(entryContentUrl).post(payload).$promise;
  }

  //Get all entries
  var getAllEntries = function(headers) {
    //Send the request to the endpoint
    //Using the payload as headers
    return sayonaraApiEndpoints.allContent(entryContentUrl, headers).get().$promise;
  }

  //Get an entry from id
  var getEntryById = function(headers) {

    //Grab the id
    var entryId = {
      id: headers.id
    }

    //Send the request to the endpoint
    //Using the payload as headers
    return sayonaraApiEndpoints.contentById(entryContentUrl, headers).get(entryId).$promise;
  }

  //Update an entry from id
  var updateEntryById = function(payload) {
    //Send the request to the endpoint
    return sayonaraApiEndpoints.contentById(entryContentUrl).update(payload).$promise;
  }

  //delete an entry from id
  var deleteEntryById = function(payload) {
    //Send the request to the endpoint
    return sayonaraApiEndpoints.contentById(entryContentUrl).delete(payload).$promise;
  }

	/**
	 *
	 *	ENTRY TYPES
	 *
	 */

  //Create a new entry type
  var createEntryType = function(payload) {
    //Send the request to the endpoint
    return sayonaraApiEndpoints.newContent(entryTypeContentUrl).post(payload).$promise;
  }

  //Get all entry Types
  var getAllEntryTypes = function(headers) {
    //Send the request to the endpoint
    //Using the payload as headers
    return sayonaraApiEndpoints.allContent(entryTypeContentUrl, headers).get().$promise;
  }

  //Get an entry from id
  var getEntryTypeById = function(headers) {

    //Grab the id
    var entryTypeId = {
      id: headers.id
    }

    //Send the request to the endpoint
    //Using the payload as headers
    return sayonaraApiEndpoints.contentById(entryTypeContentUrl, headers).get(entryTypeId).$promise;
  }

  //Update an entry type from id
  var updateEntryTypeById = function(payload) {
    //Send the request to the endpoint
    return sayonaraApiEndpoints.contentById(entryTypeContentUrl).update(payload).$promise;
  }

  //delete an entry type from id
  var deleteEntryTypeById = function(payload) {
    //Send the request to the endpoint
    return sayonaraApiEndpoints.contentById(entryTypeContentUrl).delete(payload).$promise;
  }

	/**
	 *
	 *	ADMIN
	 *
	 */

   //Get Info For Editing Content
   var getEditInfo = function(headers) {
     //Send the request to the endpoint
     //Using the payload as headers
     return sayonaraApiEndpoints.editInfo(headers).get().$promise;
   }



	//Returns for functions we are exposing
	return {
		createPage: createPage,
		getAllPages: getAllPages,
		getPageById: getPageById,
		updatePageById: updatePageById,
		deletePageById: deletePageById,
    createEntry: createEntry,
		getAllEntries: getAllEntries,
		getEntryById: getEntryById,
		updateEntryById: updateEntryById,
		deleteEntryById: deleteEntryById,
    createEntryType: createEntryType,
		getAllEntryTypes: getAllEntryTypes,
		getEntryTypeById: getEntryTypeById,
		updateEntryTypeById: updateEntryTypeById,
		deleteEntryTypeById: deleteEntryTypeById,
    getEditInfo: getEditInfo,
	}
});
