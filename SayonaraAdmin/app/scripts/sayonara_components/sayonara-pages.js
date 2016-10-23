angular.module('sayonaraPages', ['sayonaraApi', 'sayonaraAuth']).service('sayonaraPageService', function(sayonaraApiPages, sayonaraAuthService) {

	//Return all pages
	var getAllPages = function() {
		//Get out user token
		return sayonaraApiPages.getAllPages({
			token: sayonaraAuthService.getUser().token
		});
	}

	return {
		getAllPages: getAllPages
	};
});
