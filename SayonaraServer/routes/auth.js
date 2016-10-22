//Sayonara configuration
var sayonaraConfig = require('../sayonaraConfig');

//Create our router
var express = require('express');
var router = express.Router();

// User models
var mongoose = require('mongoose');
var User = mongoose.model('User');
var Permissions = mongoose.model('Permissions');

//Password Hashing
var password = require('password-hash-and-salt');


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
		}

		//User Already has the email
		if (user) {
			res.status(409).send('Uh Oh, Something went wrong.');
		}

		//Hash the password
		password(userPass).hash(function(error, hash) {
			if (error) res.status(500).json(err);

			//Create a new set of permissions
			var newPermissions = new Permissions({});

			newPermissions.save(function(err) {
				if (err) {
					done(err);
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
					}
					res.status(200).send('Success!')
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
	}

	var userEmail = req.body.email;
	var userPass = req.body.password;

	User.findOne({
		email: userEmail
	}, function(err, user) {
		if (err) {
			res.status(500).json(err);
		}

		//No user with the email
		if (!user) {
			res.status(404).send('Uh Oh, Something went wrong.');
		}

		// Verifying a hash
		password(userPass).verifyAgainst(JSON.parse(user.hash), function(error, verified) {
			if (error) res.status(500).json(err);
			if (!verified) {
				//Passwords did not match
				res.status(401).send('Uh Oh, Something went wrong.');
			} else {
				//Passwords Matched!
				//Return jwt
				res.status(200).send('Success!')
			}
		});
	});
});

module.exports = router;
