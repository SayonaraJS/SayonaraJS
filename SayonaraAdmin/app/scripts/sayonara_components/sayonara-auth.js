angular.module('sayonaraAuth', ['sayonaraApi']).service('sayonaraAuthService', function($location, sayonaraApiAuth) {

	//Define the value for our jwt
	var sayonaraAuthKey = 'sayonaraToken';

	//Function to call the api to log in
	var sayonaraApiLogin = function(email, password, permissions) {

		//Create a payload
		var payload = {
			email: email,
			password: password,
			permissions: permissions
		}

		//Pass into the api, return the promise from the api
		return sayonaraApiAuth.loginUser(payload);
	}

  //Use the api to return a promise to get all users
  var sayonaraApiGetUsers = function() {
    //Send the user's token in the header
    return sayonaraApiAuth.getAllUsers({
			token: getSayonaraUser().token
		});
  }

  //Use the api to return a promise to update a user
  var sayonaraApiUpdateUser = function(payload) {
    return sayonaraApiAuth.updateUser(payload);
  }

  //Use the api to return a promise to delete the user
  var sayonaraApiDeleteUser = function(payload) {
    return sayonaraApiAuth.deleteUser(payload);
  }


	//Function to set the sayonaraUser token from json object
	var setSayonaraUserToken = function(payload) {
		var sayonaraAuth = {
			token: payload.token,
			permissions: payload.permissions
		};
		localStorage.setItem(sayonaraAuthKey, JSON.stringify(sayonaraAuth));
	}

	//Function to logout the user
	var deleteSayonaraUserToken = function() {
		localStorage.removeItem(sayonaraAuthKey);
	}

	//Function to grab and store our JWT for the user
	var getSayonaraUser = function() {
		if (localStorage.getItem(sayonaraAuthKey)) return JSON.parse(localStorage.getItem('sayonaraToken'));
		else return false;
	}

	//Function to get the current login status of the user
	var sayonaraIsLoggedIn = function(redirectPath) {
		if (getSayonaraUser()) return true;
		else {
			//Check if we have a redirect url
			if (redirectPath) {
				//Check if we are not already on the path
				if ($location.path() != redirectPath) $location.path(redirectPath)
			}

			//Return false
			return false;
		}
	}

	return {
		isLoggedIn: sayonaraIsLoggedIn,
		loginUser: sayonaraApiLogin,
    getAllUsers: sayonaraApiGetUsers,
    updateUser: sayonaraApiUpdateUser,
    deleteUser: sayonaraApiDeleteUser,
		saveUser: setSayonaraUserToken,
		getUser: getSayonaraUser,
		logout: deleteSayonaraUserToken
	};
});
