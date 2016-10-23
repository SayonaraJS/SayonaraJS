angular.module('sayonaraAuth', ['sayonaraApi']).service('sayonaraAuthService', function($location) {

	//Define the value for our jwt
	var sayonaraAuthKey = 'sayonaraToken';

	//Function to grab and store our JWT for the user
	var getSayonaraUserToken = function() {
		if (localStorage.getItem(sayonaraAuthKey)) return localStorage.getItem('sayonaraToken');
		else return false;
	}

	//Function to set the sayonaraUser token from json object
	var setSayonaraUserToken = function(token) {
		localStorage.setItem(sayonaraAuthKey, JSON.stringify(token));
	}

	//Function to get the current login status of the user
	var sayonaraIsLoggedIn = function(redirectPath) {
		if (getSayonaraUserToken()) return true;
		else {
			//Check if we have a redirect url
			//if (redirectPath) $location.path(redirectPath);

			//Return false
			return false;
		}
	}

	return {
		isLoggedIn: sayonaraIsLoggedIn
	};
});
