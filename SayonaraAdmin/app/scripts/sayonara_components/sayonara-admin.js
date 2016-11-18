angular.module('sayonaraAdmin', ['sayonaraApi', 'sayonaraAuth']).service('sayonaraAdminService', function(sayonaraApiContent, sayonaraAuthService) {

	//Return all info for editing content
	var getSettings = function() {
		//Get out user token for the headers
		return sayonaraApiContent.getSettings({
			token: sayonaraAuthService.getUser().token
		});
	}

	return {
		getSettings: getSettings,
	};
});
