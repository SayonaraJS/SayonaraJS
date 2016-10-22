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
var EntryType = mongoose.model('EntryType');


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
router.get('/all', function(req, res) {
	//Validate our JWT and permissions
	var permissions = [routeHelpers.definedPermissions.pages];
	routeHelpers.validateUser(req, permissions).then(function(result) {

		//Find all pages
		Page.find({}, function(err, pages) {
			if (err) {
				res.status(500).json(err);
				return;
			}
			var pagesMap = {};

			pages.forEach(function(page) {
				pagesMap[page._id] = page;
			});

			res.send(pagesMap);
		});
	}, function(error) {
		res.status(error.status).send(error.message);
	});
});

//Get a page (All the way down to entries)
router.get('/id/:id', function(req, res) {
	//Validate our JWT and permissions
	var permissions = [routeHelpers.definedPermissions.pages];
	routeHelpers.validateUser(req, permissions).then(function(result) {

		//Find all pages
		Page.find({
			_id: req.params.id
		}, function(err, pages) {
			if (err) {
				res.status(500).json(err);
				return;
			}
			if (!pages) res.status(404).send('Id not found');

			//Get the entry types for the pages
			EntryType.find({
				'_id': {
					$in: pages.entryTypes
				}
			}, function(err, entryTypes) {
				if (err) {
					res.status(500).json(err);
					return;
				}
				if (!entryTypes) res.status(200).json(pages);

				//Log our entry types
				console.log('Entry Types: ' + entryTypes);
				//TODO: Add Support for Entry Types
				res.status(200).send('successful so far!');
			})

		});
	}, function(error) {
		res.status(error.status).send(error.message);
	});
});

//Update a page

//Delete a page

module.exports = router;
