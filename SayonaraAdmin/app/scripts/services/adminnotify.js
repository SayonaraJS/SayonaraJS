'use strict';


angular.module('sayonaraAdminApp')
	.service('adminNotify', function($mdToast, $location, sayonaraAuthService) {

		//Function to show notifications to the user
		var showAlert = function(text, callback) {

			//Show the alert in a toast
			$mdToast.show(
				$mdToast.simple()
				.textContent(text)
				.toastClass('appToast')
				.position('top right'));

			//Call the callback
			if (callback) callback();
		};

		//Functions to be returned to the user
		return {
			showAlert: function(alertText, callback) {
				//Show a custom alert
				showAlert(alertText, callback);
			},

			error: function(response, customHandlers) {

				//Our status that we are handling
				var status = -1;

				//Search through our response handlers if we got a specific
				//error we wanted to Handle
				if (customHandlers) {
					for (var i = 0; i < customHandlers.length; i++) {

						//Check if our response Handler is for our status
						if (response.status == customHandlers[i].status) {

							//Make the handled status this status
							status = response.status;

							//Create the alert
							if (customHandlers[i].callback) showAlert(customHandlers[i].text, customHandlers[i].callback(response));
							else showAlert(customHandlers[i].text);
						}
					}
				}

				//Check if we handled any statuses, if we did not
				//Go through default error handling
				if (status < 0) {

					if (response.status == 401) {
						//401 error

						//Show alert
						showAlert("Authentication error. Please log back in!");

						//Logout the user
						sayonaraAuthService.logout();
					} else if (response.status == 402) {
						//402 Error

					} else if (response.status == 404) {
						//404 error

						//Show alert
						showAlert("Not Found, Something could not be found. Please contact your developers, or try again");
					} else if (response.status == -1) {
						//No Internet Connection

						//Show alert
						showAlert("No Connection, Internet Connection is required to use this app. Please connect to the internet with your device, and restart the app.");
					} else if (response.status == 500) {
						//500 error

						//Show alert
						showAlert("Server Error, Your connection may be bad, or the server is being problematic. Please contact your developer, or try again later.");
					} else {
						//General Error

						//An unexpected error has occured
						//Show alert
						showAlert("Error Status: " + response.status + ", Unexpected Error. Please re-open the app, or try again later!");
					}
				}
			}
		}
	});
