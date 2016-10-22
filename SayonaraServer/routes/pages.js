//Sayonara configuration
var sayonaraConfig = require('../sayonaraConfig');

//Create our router
var express = require('express');
var router = express.Router();

//Helper functions
var routeHelpers = require('./routeHelpers');

// User models
var mongoose = require('mongoose');
var Page = mongoose.model('Page');


//Create a new Page
router.post('/create', function(req, res) {

	//Check for required fields
	if (!req.body || !req.body.title) res.status(400).send('Missing parameters');

	//Validate our JWT and permissions
	var permissions = [routeHelpers.definedPermissions.pages];
	routeHelpers.validateUser(req, permissions).then(function(result) {

		//Perform the action
		//Create a new page
		var newPage = new Page({
			title: req.body.title
		});

		newPage.save(function(err) {
			if (err) {
				res.status(500).send('Error saving the page.');
				return;
			}
			res.status(200).send('Success!');
		})
	}, function(error) {
		res.status(error.status).send(error.message);
	});

});

//Get all Pages

//Get a page (All the way down to entries)

//Update a page

//Delete a page

module.exports = router;
