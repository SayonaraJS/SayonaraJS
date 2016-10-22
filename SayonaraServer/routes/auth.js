//Sayonara configuration
var sayonaraConfig = require('../sayonaraConfig');

//Password Hashing
var password = require('password-hash-and-salt');

//JWTs
var jwt = require('jsonwebtoken');

//Create our router
var express = require('express');
var router = express.Router();

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
		res.status(400).send('Uh Oh, Something went wrong.');
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
	}, function(err, user) {
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
					token: jwtToken
				});
			}
		});
	});
});

module.exports = router;
