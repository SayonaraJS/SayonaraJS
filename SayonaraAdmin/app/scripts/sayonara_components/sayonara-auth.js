angular.module('sayonaraAuth', ['sayonaraApi']).service('sayonaraAuthService', function($location, sayonaraApiAuth) {

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

	//Function to call the api to log in
	var sayonaraApiLogin = function(email, password) {

		//Create a payload
		var payload = {
			email: email,
			password: password
		}

		//Pass into the api, return the promise
		return sayonaraApiAuth.loginUser(payload);
	}

	return {
		isLoggedIn: sayonaraIsLoggedIn,
		loginUser: sayonaraApiLogin
	};
});
