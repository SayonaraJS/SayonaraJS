angular.module('sayonaraAdmin', ['sayonaraApi', 'sayonaraAuth']).service('sayonaraAdminService', function(sayonaraApiContent, sayonaraAuthService) {

	//Return all info for editing content
	var getEditInfo = function() {
		//Get out user token for the headers
		return sayonaraApiContent.getEditInfo({
			token: sayonaraAuthService.getUser().token
		});
	}

	return {
		getEditInfo: getEditInfo,
	};
});
