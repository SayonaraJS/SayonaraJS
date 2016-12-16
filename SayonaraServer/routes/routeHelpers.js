//Sayonara configuration
var sayonaraConfig = require('../sayonaraConfig');

//Promises
var Promise = require('promise');

//JWTs
var jwt = require('jsonwebtoken');

//Read/Write files
var path = require('path');
var fs = require('fs');

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
	},
	editSayonaraConfig: function(jsonFile) {
		return new Promise(function(resolve, reject) {

			//Preserve our comments for user friendliness
			var fileComments = '//Sayonara config contains secrets for JWT, database URLs, etc..\n//For New Sayonara users, we highly recommend you do NOT upload your sayonaraConfig file to git\n//Any Custom Sayonara Config Values Go Here. They will become Editable on the Admin, Sayonara config Page!\n//Setting "runInitialSetup" to true, will allow you to clear your website, and re-run the setup.\n//Don\'t remove the default json atrributes on this config file, as it can break your server.\n//Default Json atrributes:\n//appPort: "8000", dbUrl: "mongodb://localhost/sayonara", clientRoot: "../SayonaraClients/helooo", authSecret: "listredcomputercup1%", authIssuer: "Sayonara", siteName: "Sayonara Default", runInitialSetup: false, initialSetupDate: "Date goes here"';
			var commentedFile = fileComments + '\nmodule.exports = ' + JSON.stringify(jsonFile, null, 4);

			//Save the edited file/JSON
			fs.writeFile(path.join(__dirname, '/../sayonaraConfig.js'), commentedFile, function (err) {
			  if (err) {
				  reject({
					  status: 500,
					  message: 'Could not save the edited file'
				  })
			  }

			  //There was no error!
			  resolve(jsonFile);
			});
		});
	}
}
