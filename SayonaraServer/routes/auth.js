//Sayonara configuration
var sayonaraConfig = require('../sayonaraConfig');

//Password Hashing
var password = require('password-hash-and-salt');

//Promise
var Promise = require('promise');

//JWTs
var jwt = require('jsonwebtoken');

//Create our router
var express = require('express');
var router = express.Router();

//Our route helpers
var routeHelpers = require('./routeHelpers');

// User models
var mongoose = require('mongoose');
var User = mongoose.model('User');
var Permissions = mongoose.model('Permissions');

//Signup/Create users
router.post('/create', function(req, res) {

	//Get the required fields
	if (!req.body ||
		!req.body.email ||
		!req.body.password) {
		res.status(401).send('Uh Oh, Something went wrong. Missing Fields');
	}

	var userEmail = req.body.email;
	var userPass = req.body.password;

	//Look for a user of the same name
	User.findOne({
		email: userEmail
	}, function(err, user) {
		if (err) {
			res.status(500).json(err);
			return;
		}

		//User Already has the email
		if (user) {
			res.status(409).send('User already exists with that username.');
			return;
		}

		//Hash the password
		password(userPass).hash(function(error, hash) {
			if (error) {
				res.status(500).json(err);
				return;
			}

			//Create a new set of permissions
			var newPermissions = new Permissions({});

			newPermissions.save(function(err) {
				if (err) {
					res.status(500).json(err);
					return;
				}
				//Create new mongoose user
				var user = new User({
					email: userEmail,
					hash: JSON.stringify(hash),
					permissions: newPermissions.id
				});

				// Saving the User to the database
				user.save(function(err) {
					if (err) {
						res.status(500).send('Uh Oh, Something went wrong.');
						return;
					}

					//Success! Don't Create a JWT, since users will be creating one another
					// create a JWT, expires in one week
					// var jwtToken = jwt.sign(user, sayonaraConfig.authSecret, {
					// 	expiresIn: '7 days'
					// });

					//Get the populated user
					var populatedUser = user;
					populatedUser.permissions = newPermissions;

					res.status(200).json({
						success: true,
						message: 'Success!',
						user: populatedUser
					});
				});
			});
		});
	});
});

//Login/welcome back users
router.post('/login', function(req, res) {

	//Get the required fields
	if (!req.body ||
		!req.body.email ||
		!req.body.password) {
		res.status(400).send('Uh Oh, Something went wrong.');
		return;
	}

	var userEmail = req.body.email;
	var userPass = req.body.password;

	User.findOne({
		email: userEmail
	}).populate('permissions').exec(function(err, user) {
		if (err) {
			res.status(500).json(err);
			return;
		}

		//No user with the email
		if (!user) {
			res.status(404).send('User could not be found.');
			return;
		}

		// Verifying a hash
		password(userPass).verifyAgainst(JSON.parse(user.hash), function(error, verified) {
			if (error) {
				res.status(500).json(err);
				return;
			}
			if (!verified) {
				//Passwords did not match
				res.status(401).send('Incorrect Password.');
				return;
			} else {
				//Passwords Matched!

				//Success! Finally return a JWT to the user
				// create a JWT, expires in one week
				var jwtToken = jwt.sign(user, sayonaraConfig.authSecret, {
					expiresIn: '7 days'
				});

				res.status(200).json({
					success: true,
					message: 'Success!',
					token: jwtToken,
					permissions: user.permissions
				});
			}
		});
	});
});

//Get all users
router.get('/user/all', function(req, res) {
	//Validate our JWT and permissions
	var permissions = [routeHelpers.definedPermissions.admin];
	routeHelpers.validateUser(req, permissions).then(function(result) {

		//Find all users and return them
		User.find({}).populate('permissions').exec(function(err, users) {
			if (err) {
				res.status(500).json(err);
				return;
			}

			//Return the pages
			res.status(200).json(users);
		});
	});
});

//Edit a user
router.put('/user/id/:id', function(req, res) {
	//Validate our JWT and permissions
	var permissions = [routeHelpers.definedPermissions.admin];
	routeHelpers.validateUser(req, permissions).then(function(result) {

		//Find the user
		User.findOne({
			_id: req.params.id
		}, function(err, user) {
			if (err) {
				res.status(500).json(err);
				return;
			}

			//Our promises for editing the user
			var editPromises = [];

			//Edit the passed fields
			//Check for emails
			if(req.body.email) {
				//Ensure the email isnt already taken
				editPromises.push(new Promise(function(resolve, reject) {
					User.findOne({
						email: req.body.email
					}).exec(function(err, foundUser) {
						if (err) {
							reject({
								status: 500,
								json: error
							});
						}

						//User Already has the email
						if (foundUser) {
							reject({
								status: 409,
								json: {reason: 'User already exists with that username.'}
							});
						}

						//No User has the email, set it to the current user
						user.email = req.body.email;
					})
				}));
			}

			//Check for a password change
			if(req.body.password && req.body.newPassword) {
				//Create a promise for hashing
				editPromises.push(new Promise(function(resolve, reject) {
					//First verify the current password
					password(req.body.password).verifyAgainst(JSON.parse(user.hash), function(error, verified) {
						if (error) res.status(500).json(err);
						if (!verified) {
							//Passwords did not match
							reject({
								status: 403,
								json: {reason: 'Incorrect Password.'}
							});
						} else {
							//Hash the password
							password(req.body.newPassword).hash(function(error, hash) {
								if (error) {
									reject({
										status: 500,
										json: error
									});
								}

								user.hash = JSON.stringify(hash);
								resolve();
							});
						}
					});
				}));
			}


			if(req.body.permissions) {
				//Create a promise for permission editing
				editPromises.push(new Promise(function(resolve, reject) {
					//Find the permissions of the user
					Permissions.findOne({
						_id: req.body.permissions._id
					}).exec(function(error, permissions) {
						if (error) {
							reject({
								status: 500,
								json: error
							});
						}

						//If we could not find the permissions
						if(!permissions) {
							reject({
								status: 404,
								json: {reason: "Could not find the user's permissions"}
							});
						}

						//Loop through the Schema paths
						//Keep these consitent with schema
						var crudPermissionTypes = [
							'entries',
							'entryTypes',
							'pages'
						];
						var crudKeys = [
							'create',
							'read',
							'update',
							'delete'
						];
						//Permission types
						for(var i = 0; i < crudPermissionTypes.length; i++) {
							//Crud keys
							for(var k = 0; k < crudKeys.length; k++) {
								if(req.body.permissions[crudPermissionTypes[i]] &&
									typeof req.body.permissions[crudPermissionTypes[i]][crudKeys[k]] === 'boolean') {
										permissions[crudPermissionTypes[i]][crudKeys[k]] = req.body.permissions[crudPermissionTypes[i]][crudKeys[k]]
									}
							}
						}

						//Finally check the admin key
						if(typeof req.body.permissions.admin === 'boolean') permissions.admin = req.body.permissions.admin;

						//Save the permissions
						permissions.save(function(err) {
							if (error) {
								reject({
									status: 500,
									json: error
								});
							}

							//Resolve the promise
							resolve();
						});
					});
				}));
			}

			//Once all promises resolve, save the edited user
			Promise.all(editPromises).then(function() {
				//Save the user
				user.save(function(err) {
					if (err) {
						res.status(500).json(err);
						return;
					}
					//Return the User
					res.status(200).json(user);
				});
			}, function(error) {
				//Rejected promise, return the error
				res.status(error.status).json(error.json);
				return;
			});
		});
	});
});

//Delete a user
router.delete('/user/id/:id', function(req, res) {
	//Validate our JWT and permissions
	var permissions = [routeHelpers.definedPermissions.admin];
	routeHelpers.validateUser(req, permissions).then(function(result) {

		//Check if we are trying to delete ourselves
		if(result.user.id == req.params.id) {
			res.status(401).send('User cannot delete themselves');
			return;
		}

		//Find the user
		User.findOne({
			_id: req.params.id
		}, function(err, user) {
			if (err) {
				res.status(500).json(err);
				return;
			}

			//Find the user's permissions
			Permissions.findOne({
				_id: user.permissions
			}).exec(function(err, permissions) {
				if (err) {
					res.status(500).json(err);
					return;
				}

				//Delete the permissions
				permissions.remove(function(err) {
					if (err) {
						res.status(500).json(err);
						return;
					}

					//Delete the user
					user.remove(function(err) {
						if (err) {
							res.status(500).json(err);
							return;
						}

						//Return success
						res.send('Deleted!');
					});
				});
			});
		});
	});
})

module.exports = router;
