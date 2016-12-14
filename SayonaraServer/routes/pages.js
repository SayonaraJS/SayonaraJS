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
var Entry = mongoose.model('Entry');
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

		//Check for any optional fields
		if (req.body.date) newPage.date = req.body.date;
		if (req.body.content) newPage.content = req.body.content;
		if (req.body.entryTypes) newPage.entryTypes = req.body.entryTypes;
		if (req.body.categories) newPage.categories = req.body.categories;

		newPage.save(function(err) {
			if (err) {
				res.status(500).send('Error saving the page.');
				return;
			}
			res.status(200).json(newPage);
		})
	}, function(error) {
		res.status(error.status).send(error.message);
	});

});

//Get all Pages
//Not Authenticated since used by public website
router.get('/all', function(req, res) {
	//Find all pages
	Page.find({}, function(err, pages) {
		if (err) {
			res.status(500).json(err);
			return;
		}

		//Return the pages
		res.send(pages);
	});
});

//Get a page
router.get('/id/:id', function(req, res) {
	//Validate our JWT and permissions
	var permissions = [routeHelpers.definedPermissions.pages];
	routeHelpers.validateUser(req, permissions).then(function(result) {

			//Find all pages
			Page.findOne({
				_id: req.params.id
			}).exec(function(err, pages) {
				if (err) {
					res.status(500).json(err);
					return;
				}
				if (!pages) res.status(404).send('Id not found');

				//Return the pages
				res.status(200).json(pages);
			});
		},
		function(error) {
			res.status(error.status).send(error.message);
		});
});

//Update a page
router.put('/id/:id', function(req, res) {

	//Check for required fields
	if (!req.body) res.status(400).send('Missing parameters');

	//Validate our JWT and permissions
	var permissions = [routeHelpers.definedPermissions.pages];
	routeHelpers.validateUser(req, permissions).then(function(result) {

		//Perform the action
		//Find the page
		Page.findOne({
			_id: req.params.id
		}, function(err, page) {
			if (!page) {
				res.status(404).send('Page could not be found');
				return;
			}
			//Check for any optional fields
			if (req.body.date) page.date = req.body.date;
			if (req.body.title) page.title = req.body.title;
			if (req.body.content) page.content = req.body.content;
			if (req.body.entryTypes) page.entryTypes = req.body.entryTypes;
			if (req.body.categories) page.categories = req.body.categories;

			page.save(function(err) {
				if (err) {
					res.status(500).send('Error saving the page.');
					return;
				}
				res.status(200).json(page);
			})
		})
	}, function(error) {
		res.status(error.status).send(error.message);
	});

});

//Delete a page
router.delete('/id/:id', function(req, res) {

	//Check for required fields
	if (!req.body) res.status(400).send('Missing parameters');

	//Validate our JWT and permissions
	var permissions = [routeHelpers.definedPermissions.pages];
	routeHelpers.validateUser(req, permissions).then(function(result) {

		//Perform the action
		//Find the page
		Page.findOne({
			_id: req.params.id
		}, function(err, page) {
			if (!page) {
				res.status(404).send('Page could not be found');
				return;
			}
			page.remove(function(err) {
				if (err) {
					res.status(500).send('Error deleting the page.');
					return;
				}
				res.status(200).send('Deleted!');
			})
		})
	}, function(error) {
		res.status(error.status).send(error.message);
	});

});

module.exports = router;
