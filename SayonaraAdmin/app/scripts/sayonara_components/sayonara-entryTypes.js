angular.module('sayonaraEntryType', ['sayonaraApi', 'sayonaraAuth']).service('sayonaraEntryTypeService', function(sayonaraApiContent, sayonaraAuthService) {

	//Return all EntryTypes
	var getAllEntryTypes = function(shouldPopulate) {
		//Get out user token for the headers
		return sayonaraApiContent.getAllEntryTypes({
			token: sayonaraAuthService.getUser().token,
      populate: shouldPopulate
		});
	}

	//Get an EntryType by their id
	var getEntryTypeById = function(EntryTypeId) {
		//Get out user token
		return sayonaraApiContent.getEntryTypeById({
			token: sayonaraAuthService.getUser().token,
			id: EntryTypeId
		});
	};

	//Create a new EntryType
	var createEntryType = function(payload) {
		//Add the token to the payload
		payload.token = sayonaraAuthService.getUser().token;
		return sayonaraApiContent.createEntryType(payload);
	}

	//Update a EntryType by id
	var updateEntryTypeById = function(id, payload) {

    //Add our required fields
    payload.token = sayonaraAuthService.getUser().token;
    payload.id = id;

		return sayonaraApiContent.updateEntryTypeById(payload);
	}

	//Delete a EntryType by id
	var deleteEntryTypeById = function(id) {
		//Grab the id
		var body = {
			token: sayonaraAuthService.getUser().token,
			id: id
		}

		return sayonaraApiContent.deleteEntryTypeById(body);
	}

	return {
		getAllEntryTypes: getAllEntryTypes,
		getEntryTypeById: getEntryTypeById,
		createEntryType: createEntryType,
		updateEntryTypeById: updateEntryTypeById,
		deleteEntryTypeById: deleteEntryTypeById
	};
});
