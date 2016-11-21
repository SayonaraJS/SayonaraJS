angular.module('sayonaraEntries', ['sayonaraApi', 'sayonaraAuth']).service('sayonaraEntryService', function(sayonaraApiContent, sayonaraAuthService) {

	//Return all entries
	var getAllEntries = function() {
		//Get out user token for the headers
		return sayonaraApiContent.getAllEntries({
			token: sayonaraAuthService.getUser().token
		});
	}

	//Get an entry by their id
	var getEntryById = function(entryId) {
		//Get out user token
		return sayonaraApiContent.getEntryById({
			token: sayonaraAuthService.getUser().token,
			id: entryId
		});
	};

	//Create a new entry
	var createEntry = function(payload) {
		//Add the token to the payload
		payload.token = sayonaraAuthService.getUser().token;
		return sayonaraApiContent.createEntry(payload);
	}

	//Update a Entry by id
	var updateEntryById = function(id, payload) {
    //Grab the id and token
		payload.token = sayonaraAuthService.getUser().token;
		payload.id = id;

		return sayonaraApiContent.updateEntryById(payload);
	}

	//Delete a Entry by id
	var deleteEntryById = function(id) {
		//Grab the id
		var body = {
			token: sayonaraAuthService.getUser().token,
			id: id
		}

		return sayonaraApiContent.deleteEntryById(body);
	}

	return {
		getAllEntries: getAllEntries,
		getEntryById: getEntryById,
		createEntry: createEntry,
		updateEntryById: updateEntryById,
		deleteEntryById: deleteEntryById
	};
});
