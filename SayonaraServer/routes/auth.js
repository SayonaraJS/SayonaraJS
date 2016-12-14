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

					//Success! Finally return a JWT to the user
					// create a JWT, expires in one week
					var jwtToken = jwt.sign(user, sayonaraConfig.authSecret, {
						expiresIn: '7 days'
					});

					res.status(200).json({
						success: true,
						message: 'Success!',
						token: jwtToken
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
			if (error) res.status(500).json(err);
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
router.get('/users', function(req, res) {
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
			res.send(users);
		});
	});
});

//Edit a user
router.post('/user/:id', function(req, res) {
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
			if(req.body.password) {
				//Create a promise for hashing
				editPromises.push(new Promise(function(resolve) {
					//Hash the password first
					//Hash the password
					password(userPass).hash(function(error, hash) {
						if (error) {
							res.status(500).json(err);
							//TODO: reject the promise
							return;
						}

						user.hash = hash;
						resolve();
					});
				}));
			}
			if(req.body.permissions) {
				//Create a promise for permission editing
				editPromises.push(new Promise(function(resolve) {
					//Find the permissions of the user
					Permissions.findOne({
						_id: user.permissions
					}).exec(function(err, permissions) {
						if (error) {
							res.status(500).json(err);
							//TODO: reject the promise
							return;
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
							for(var k = 0; k < crudKeys.length; i++) {
								if(req.body.permissions.crudPermissionTypes[i] &&
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
								res.status(500).json(err);
								//TODO: reject the promise
								return;
							}

							//Resolve the promise
							resolve();
						});
					});
				}));
			}

			//Edit the other fields while the promises are running
			if(req.body.email) user.email = req.body.email;

			//Once all promises resolve, save the edited user
			Promise.all(editPromises).then(function() {
				//Save the user
				user.save(function(err) {
					if (err) {
						res.status(500).json(err);
						return;
					}
					//Return the User
					res.send(user);
				});
			});
		});
	});
});

//Delete a user
router.delete('/user/:id', function(req, res) {
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
