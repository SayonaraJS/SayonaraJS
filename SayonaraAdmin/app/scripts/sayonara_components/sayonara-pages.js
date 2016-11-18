angular.module('sayonaraPages', ['sayonaraApi', 'sayonaraAuth']).service('sayonaraPageService', function(sayonaraApiContent, sayonaraAuthService) {

	//Return all pages
	var getAllPages = function() {
		//Get out user token
		return sayonaraApiContent.getAllPages({
			token: sayonaraAuthService.getUser().token
		});
	}

	//Get a page by their id
	var getPageById = function(pageId) {
		//Get out user token
		return sayonaraApiContent.getPageById({
			token: sayonaraAuthService.getUser().token,
			id: pageId
		});
	};

	//Create a new page
	var createPage = function(payload) {
		//Add the token to the payload
		payload.token = sayonaraAuthService.getUser().token;
		return sayonaraApiContent.createPage(payload);
	}

	//Update a page by id
	var updatePageById = function(id, payload) {
		//Grab the id
		var body = {
			token: sayonaraAuthService.getUser().token,
			id: id
		}

		//Add optional fields
		if (payload.title) body.title = payload.title;
		if (payload.content) body.content = payload.content;

		return sayonaraApiContent.updatePageById(body);
	}

	//Delete a page by id
	var deletePageById = function(id) {
		//Grab the id
		var body = {
			token: sayonaraAuthService.getUser().token,
			id: id
		}

		return sayonaraApiContent.deletePageById(body);
	}

	return {
		getAllPages: getAllPages,
		getPageById: getPageById,
		createPage: createPage,
		updatePageById: updatePageById,
		deletePageById: deletePageById
	};
});
