angular.module('sayonaraCustomFieldType', ['sayonaraApi', 'sayonaraAuth']).service('sayonaraCustomFieldTypeService', function(sayonaraApiContent, sayonaraAuthService) {

	//Create a new Category
	var createCustomFieldType = function(payload) {
		//Add the token to the payload
		payload.token = sayonaraAuthService.getUser().token;
		return sayonaraApiContent.createCustomFieldType(payload);
	}

	//Update a Category by id
	var updateCustomFieldTypeById = function(id, payload) {

    //Add our required fields
    payload.token = sayonaraAuthService.getUser().token;
    payload.id = id;

		return sayonaraApiContent.updateCustomFieldTypeById(payload);
	}

	//Delete a Category by id
	var deleteCustomFieldTypeById = function(id) {
		//Grab the id
		var body = {
			token: sayonaraAuthService.getUser().token,
			id: id
		}

		return sayonaraApiContent.deleteCustomFieldTypeById(body);
	}

	return {
		createCustomFieldTypeField: createCustomFieldTypeField,
		updateCustomFieldTypeById: updateCustomFieldTypeById,
		deleteCustomFieldTypeById: deleteCustomFieldTypeById
	};
});
