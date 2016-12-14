angular.module('sayonaraAdmin', ['sayonaraApi', 'sayonaraAuth']).service('sayonaraAdminService', function(sayonaraApiAdmin, sayonaraAuthService) {

	//Return all info for editing content
	var getSettings = function() {
		//Get out user token for the headers
		return sayonaraApiAdmin.getSettings({
			token: sayonaraAuthService.getUser().token
		});
	}

  //TODO: Add sayonara config editing

	return {
		getSettings: getSettings,
	};
});
