var module = angular.module('sayonaraApi', ['sayonaraAdminBuildConfig']);
module.service('sayonaraApiEndpoints', function($location, $resource, ENV) {

	//Get the host for the app
	var sayonaraApiHost = $location.protocol() + '://' + $location.host() + ':'+  $location.port() + '/api';
  if(ENV.devApiPort) sayonaraApiHost = $location.protocol() + '://' + $location.host() + ':' +  ENV.devApiPort + '/api';

	//Returns for functions we are exposing
	return {
		usersLogin: $resource(sayonaraApiHost + '/auth/login', {}, {
			post: {
				method: 'POST',
				params: {},
				isArray: false
			}
		}),
    usersCreate: $resource(sayonaraApiHost + '/auth/create', {}, {
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
		settings: function(customHeaders) {
			return $resource(sayonaraApiHost + '/admin/settings', {}, {
				get: {
					method: 'GET',
					params: {},
					isArray: false,
					headers: customHeaders || {}
				}
			});
		},
    sayonaraConfig: function(customHeaders) {
			return $resource(sayonaraApiHost + '/sayonara/', {}, {
				get: {
					method: 'GET',
					params: {},
					isArray: false,
					headers: customHeaders || {}
				},
        put: {
					method: 'PUT',
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

  var userApiUrl = 'auth/user';

  //Create a user
  var createUser = function(payload) {
    //Send the request to the endpoint
		return sayonaraApiEndpoints.usersCreate.post(payload).$promise;
  }

	//Login a user
	var loginUser = function(payload) {
		//Send the request to the endpoint
		return sayonaraApiEndpoints.usersLogin.post(payload).$promise;
	}

  //Get all Users
	var getAllUsers = function(headers) {
		//Send the request to the endpoint
		//Using the payload as headers
		return sayonaraApiEndpoints.allContent(userApiUrl, headers).get().$promise;
	}

  //Edit a user
  var updateUser = function(payload) {
    //Send the request to the endpoint
    return sayonaraApiEndpoints.contentById(userApiUrl).update(payload).$promise;
  }

  //Delete a user
  var deleteUser = function(payload) {
    //Send the request to the endpoint
    return sayonaraApiEndpoints.contentById(userApiUrl).delete(payload).$promise;
  }


	//Returns for functions we are exposing
	return {
		loginUser: loginUser,
    getAllUsers: getAllUsers,
    createUser: createUser,
    updateUser: updateUser,
    deleteUser: deleteUser
	}
});

module.service('sayonaraApiAdmin', function(sayonaraApiEndpoints) {
  //Get Info For Editing Content
  var getSettings = function(headers) {
    //Send the request to the endpoint
    //Using the payload as headers
    return sayonaraApiEndpoints.settings(headers).get().$promise;
  }

  //Get sayonara config file
  var getConfig = function(headers) {
    //Send the request to the endpoint
    //Using the payload as headers
    return sayonaraApiEndpoints.sayonaraConfig(headers).get().$promise;
  }

  //Edit sayonara config file
  var updateConfig = function(payload) {
		//Send the request to the endpoint
		return sayonaraApiEndpoints.sayonaraConfig().put(payload).$promise;
	}

  //Returns for functions we are exposing
	return {
		getSettings: getSettings,
    getConfig: getConfig,
    updateConfig: updateConfig
	}
});

module.service('sayonaraApiContent', function(sayonaraApiEndpoints) {

	//Perform actions based on our endpoints

  //Define out content type urls
  var pageContentPath = 'pages';
  var entryContentPath = 'entry';
  var entryTypeContentPath = 'entrytype';
  var categoryContentPath = 'category';
	var customFieldTypeContentPath = 'customfieldtype';

	/**
	 *
	 *	PAGES
	 *
	 */

	//Create a new page
	var createPage = function(payload) {
		//Send the request to the endpoint
		return sayonaraApiEndpoints.newContent(pageContentPath).post(payload).$promise;
	}

	//Get all pages
	var getAllPages = function(headers) {
		//Send the request to the endpoint
		//Using the payload as headers
		return sayonaraApiEndpoints.allContent(pageContentPath, headers).get().$promise;
	}

	//Get a page from id
	var getPageById = function(headers) {

		//Grab the id
		var pageId = {
			id: headers.id
		}

		//Send the request to the endpoint
		//Using the payload as headers
		return sayonaraApiEndpoints.contentById(pageContentPath, headers).get(pageId).$promise;
	}

	//Update a page from id
	var updatePageById = function(payload) {
		//Send the request to the endpoint
		return sayonaraApiEndpoints.contentById(pageContentPath).update(payload).$promise;
	}

	//delete a page from id
	var deletePageById = function(payload) {
		//Send the request to the endpoint
		return sayonaraApiEndpoints.contentById(pageContentPath).delete(payload).$promise;
	}

	/**
	 *
	 *	ENTRIES
	 *
	 */

  //Create a new entry
  var createEntry = function(payload) {
    //Send the request to the endpoint
    return sayonaraApiEndpoints.newContent(entryContentPath).post(payload).$promise;
  }

  //Get all entries
  var getAllEntries = function(headers) {
    //Send the request to the endpoint
    //Using the payload as headers
    return sayonaraApiEndpoints.allContent(entryContentPath, headers).get().$promise;
  }

  //Get an entry from id
  var getEntryById = function(headers) {

    //Grab the id
    var entryId = {
      id: headers.id
    }

    //Send the request to the endpoint
    //Using the payload as headers
    return sayonaraApiEndpoints.contentById(entryContentPath, headers).get(entryId).$promise;
  }

  //Update an entry from id
  var updateEntryById = function(payload) {
    //Send the request to the endpoint
    return sayonaraApiEndpoints.contentById(entryContentPath).update(payload).$promise;
  }

  //delete an entry from id
  var deleteEntryById = function(payload) {
    //Send the request to the endpoint
    return sayonaraApiEndpoints.contentById(entryContentPath).delete(payload).$promise;
  }

	/**
	 *
	 *	ENTRY TYPES
	 *
	 */

  //Create a new entry type
  var createEntryType = function(payload) {
    //Send the request to the endpoint
    return sayonaraApiEndpoints.newContent(entryTypeContentPath).post(payload).$promise;
  }

  //Get all entry Types
  var getAllEntryTypes = function(headers) {
    //Send the request to the endpoint
    //Using the payload as headers
    return sayonaraApiEndpoints.allContent(entryTypeContentPath, headers).get().$promise;
  }

  //Get an entry from id
  var getEntryTypeById = function(headers) {

    //Grab the id
    var entryTypeId = {
      id: headers.id
    }

    //Send the request to the endpoint
    //Using the payload as headers
    return sayonaraApiEndpoints.contentById(entryTypeContentPath, headers).get(entryTypeId).$promise;
  }

  //Update an entry type from id
  var updateEntryTypeById = function(payload) {
    //Send the request to the endpoint
    return sayonaraApiEndpoints.contentById(entryTypeContentPath).update(payload).$promise;
  }

  //delete an entry type from id
  var deleteEntryTypeById = function(payload) {
    //Send the request to the endpoint
    return sayonaraApiEndpoints.contentById(entryTypeContentPath).delete(payload).$promise;
  }

	/**
	 *
	 *	Categories
	 *
	 */

   //Create a new entry type
   var createCategory = function(payload) {
     //Send the request to the endpoint
     return sayonaraApiEndpoints.newContent(categoryContentPath).post(payload).$promise;
   }

   //Update an entry type from id
   var updateCategoryById = function(payload) {
     //Send the request to the endpoint
     return sayonaraApiEndpoints.contentById(categoryContentPath).update(payload).$promise;
   }

   //delete an entry type from id
   var deleteCategoryById = function(payload) {
     //Send the request to the endpoint
     return sayonaraApiEndpoints.contentById(categoryContentPath).delete(payload).$promise;
   }

	 /**
 	 *
 	 *	CustomFieldType
 	 *
 	 */

    //Create a new custom filed type
    var createCustomFieldType = function(payload) {
      //Send the request to the endpoint
      return sayonaraApiEndpoints.newContent(customFieldTypeContentPath).post(payload).$promise;
    }

    //Update a custom field type by id
    var updateCustomFieldTypeById = function(payload) {
      //Send the request to the endpoint
      return sayonaraApiEndpoints.contentById(customFieldTypeContentPath).update(payload).$promise;
    }

    //delete a custom field type
    var deleteCustomFieldTypeById = function(payload) {
      //Send the request to the endpoint
      return sayonaraApiEndpoints.contentById(customFieldTypeContentPath).delete(payload).$promise;
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
    createCategory: createCategory,
    updateCategoryById: updateCategoryById,
    deleteCategoryById: deleteCategoryById,
		createCustomFieldType: createCustomFieldType,
		updateCustomFieldTypeById: updateCustomFieldTypeById,
		deleteCustomFieldTypeById: deleteCustomFieldTypeById
	}
});
