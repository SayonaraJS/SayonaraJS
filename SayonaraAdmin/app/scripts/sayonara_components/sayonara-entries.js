angular.module('sayonaraEntries', ['sayonaraApi', 'sayonaraAuth']).service('sayonaraEntryService', function(sayonaraApiEntries, sayonaraAuthService) {

	//Return all entries
	var getAllEntries = function() {
		//Get out user token for the headers
		return sayonaraApiEntries.getAllEntries({
			token: sayonaraAuthService.getUser().token
		});
	}

	//Get an entry by their id
	var getEntryById = function(entryId) {
		//Get out user token
		return sayonaraApiEntries.getEntryById({
			token: sayonaraAuthService.getUser().token,
			id: entryId
		});
	};

	//Create a new entry
	var createEntry = function(payload) {
		//Add the token to the payload
		payload.token = sayonaraAuthService.getUser().token;
		return sayonaraApiEntries.createEntry(payload);
	}

	//Update a Entry by id
	var updateEntryById = function(id, payload) {
		//Grab the id
		var body = {
			token: sayonaraAuthService.getUser().token,
			id: id
		}

		//Add optional fields
		if (payload.title) body.title = payload.title;
		if (payload.content) body.content = payload.content;

		return sayonaraApiEntries.updateEntryById(body);
	}

	//Delete a Entry by id
	var deleteEntryById = function(id) {
		//Grab the id
		var body = {
			token: sayonaraAuthService.getUser().token,
			id: id
		}

		return sayonaraApiEntries.deleteEntryById(body);
	}

	return {
		getAllEntries: getAllEntries,
		getEntryById: getEntryById,
		createEntry: createEntry,
		updateEntryById: updateEntryById,
		deleteEntryById: deleteEntryById
	};
});
