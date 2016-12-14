//Sayonara configuration
var sayonaraConfig = require('../sayonaraConfig');

//Promises
var Promise = require('promise');

//JWTs
var jwt = require('jsonwebtoken');

//User Models
var mongoose = require('mongoose');
var User = mongoose.model('User');
var Permissions = mongoose.model('Permissions');

//Recycled functions
module.exports = {
	generalServerError: function(err, res, message) {
		//TODO: Fucntion to handle our general mongoose and express errors

	},
	definedPermissions: {
		admin: 'admin',
		pages: 'pages',
		entryType: 'entryTypes',
		entries: 'entries'
	},
	validateUser: function(req, neededPermissions) {

		//Define a response
		var response = {
			status: 200,
			message: 'success!'
		};

		//Return a promise
		return new Promise(function(resolve, reject) {
			// check header or url parameters or post parameters for token
			var token = req.body.token || req.query.token || req.headers['token'] || req.headers['x-access-token'];

			// decode token
			if (token) {

				//Check if jwt is valid
				jwt.verify(token, sayonaraConfig.authSecret, function(err, decoded) {
					if (err) {
						//Return a response
						reject({
							status: 401,
							message: 'Invalid token!'
						});
					} else {

						//Check Permissions
						if (!neededPermissions) return resolve(response);
						//Get the permissions for the user
						Permissions.findOne({
							id: decoded.permissions
						}, function(err, permissions) {
							if (err) {
								reject({
									status: 404,
									message: 'Could Not Find User Permissions'
								});
							}

							//Compare to array
							for (var i = 0; i < neededPermissions.length; i++) {
								//Check if they dont have the needed permission
								if (permissions[neededPermissions[i]] == false) {
									reject({
										status: 401,
										message: 'Insufficient Permissions'
									});
								}
							}
							//Has sufficient permissions
							//Added the user to the reponse object and return
							response.user = decoded;
							return resolve(response);
						});
					}
				});
			} else {
				//Return a response
				reject({
					status: 400,
					message: 'Token not found!'
				});
			}
		});
	}
}
