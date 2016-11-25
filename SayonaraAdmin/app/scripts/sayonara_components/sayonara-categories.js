angular.module('sayonaraCategory', ['sayonaraApi', 'sayonaraAuth']).service('sayonaraCategoryService', function(sayonaraApiContent, sayonaraAuthService) {

	//Create a new Category
	var createCategory = function(payload) {
		//Add the token to the payload
		payload.token = sayonaraAuthService.getUser().token;
		return sayonaraApiContent.createCategory(payload);
	}

	//Update a Category by id
	var updateCategoryById = function(id, payload) {

    //Add our required fields
    payload.token = sayonaraAuthService.getUser().token;
    payload.id = id;

		return sayonaraApiContent.updateCategoryById(payload);
	}

	//Delete a Category by id
	var deleteCategoryById = function(id) {
		//Grab the id
		var body = {
			token: sayonaraAuthService.getUser().token,
			id: id
		}

		return sayonaraApiContent.deleteCategoryById(body);
	}

	return {
		createCategory: createCategory,
		updateCategoryById: updateCategoryById,
		deleteCategoryById: deleteCategoryById
	};
});
