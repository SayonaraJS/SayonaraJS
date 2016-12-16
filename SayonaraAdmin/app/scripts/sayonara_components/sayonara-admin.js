angular.module('sayonaraAdmin', ['sayonaraApi', 'sayonaraAuth']).service('sayonaraAdminService', function(sayonaraApiAdmin, sayonaraAuthService) {

	//Return all info for editing content
	var getSettings = function() {
		//Get out user token for the headers
		return sayonaraApiAdmin.getSettings({
			token: sayonaraAuthService.getUser().token
		});
	}

  //Get the current config json file
  var getSayonaraConfig = function() {
    //Get out user token for the headers
		return sayonaraApiAdmin.getConfig({
			token: sayonaraAuthService.getUser().token
		});
  }

  //Update the current config json file
  var updateSayonaraConfig = function(payload) {
    //Add our token to the payload
    payload.token = sayonaraAuthService.getUser().token;
    //Get out user token for the headers
		return sayonaraApiAdmin.updateConfig(payload);
  }

	return {
		getSettings: getSettings,
    getSayonaraConfig: getSayonaraConfig,
    updateSayonaraConfig: updateSayonaraConfig
	};
});
