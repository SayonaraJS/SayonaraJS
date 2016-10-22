//Create our router
var express = require('express');
var router = express.Router();

//Helper functions
var routeHelpers = require('./routeHelpers');

// User models
var mongoose = require('mongoose');
var EntryType = mongoose.model('EntryType');
var Page = mongoose.model('Page');

//Create Entry Types
router.post('/create', function(req, res) {

	//Check for required fields
	if (!req.body || !req.body.title) res.status(400).send('Missing parameters');

	//Validate our JWT and permissions
	var permissions = [routeHelpers.definedPermissions.entries, routeHelpers.definedPermissions.entryType];
	routeHelpers.validateUser(req, permissions).then(function(result) {


		//Perform the action
		//Create a new page
		var newEntryType = new EntryType({
			title: req.body.title
		});

		//Check for optional parameters
		//Booleans if the fields are enabled
		if (req.body.hasContent) newEntryField.hasContent = req.body.hasContent;
		if (req.body.hasEmbedCodes) newEntryField.hasEmbedCodes = req.body.hasEmbedCodes;
		if (req.body.hasUploadUrls) newEntryField.hasUploadUrls = req.body.hasUploadUrls;

		//Save the new entry
		newEntryType.save(function(err) {
			if (err) {
				res.status(500).send('Error saving the category.');
			}

			//Save the new entry type
			res.status(200).json(newEntryType);
		});
	}, function(error) {
		res.status(error.status).send(error.message);
	});
});

//Get all Entry types
router.get('/all', function(req, res) {
	//Validate our JWT and permissions
	var permissions = [routeHelpers.definedPermissions.entryType];
	routeHelpers.validateUser(req, permissions).then(function(result) {

		//Find all pages
		EntryType.find({}, function(err, entryTypes) {
			if (err) {
				res.status(500).json(err);
			}
			var entryTypesMap = {};

			entryTypes.forEach(function(entryType) {
				entryTypesMap[entryType._id] = entryType;
			});

			res.send(entryTypesMap);
		});
	}, function(error) {
		res.status(error.status).send(error.message);
	});
});

//Update an entryType
router.post('/id/:id', function(req, res) {

	//Check for required fields
	if (!req.body) res.status(400).send('Missing parameters');

	//Validate our JWT and permissions
	var permissions = [routeHelpers.definedPermissions.entries, routeHelpers.definedPermissions.entryType];
	routeHelpers.validateUser(req, permissions).then(function(result) {

		//Get the entryType
		EntryType.findOne({
			_id: req.param.id
		}, function(err, entryType) {

			//Check for optional parameters
			if (req.body.title) entryType.title = req.body.title;
			if (req.body.hasContent) entryType.hasContent = req.body.hasContent;
			if (req.body.hasEmbedCodes) entryType.hasEmbedCodes = req.body.hasEmbedCodes;
			if (req.body.hasUploadUrls) entryType.hasUploadUrls = req.body.hasUploadUrls;

			//Save the entry type
			entryType.save(function(err) {
				if (err) {
					res.status(500).json(err);
				}

				res.status(200).json(entryType);
			})
		});
	}, function(error) {
		res.status(error.status).send(error.message);
	});
});

//Delete an EntryType
router.delete('/id/:id', function(req, res) {

	//Validate our JWT and permissions
	var permissions = [routeHelpers.definedPermissions.entries, routeHelpers.definedPermissions.entryType];
	routeHelpers.validateUser(req, permissions).then(function(result) {

		//Find the entry type
		EntryType.findOne({
			_id: req.param.id
		}, function(err, entryType) {
			if (err) {
				res.status(500).json(err);
			}
			if (!entryType) res.status(404).send('Item Not Found');

			//Find All pages associated with the entry type
			Page.find({
				entryTypes: entryType.id
			}, function(err, pages) {
				if (err) {
					res.status(500).json(err);
				}

				//Find All Entries associate with the entry field
				Entry.find({
					entryType: entryType.id
				}, function(err, entries) {
					if (err) {
						res.status(500).json(err);
					}

					//Now that we have reference to The Entry Field, Pages, and Entries, Start removing
					//Delete all the entries
					entries.remove(function(err) {
						if (err) {
							res.status(500).json(err);
						}

						//Remove the reference to the entry field from the pages
						pages.forEach(function(page) {
							page.categories.splice(page.categories.indexOf(category.id), 1);
						});

						pages.save(function(err) {
							if (err) {
								res.status(500).json(err);
							}

							//Finally delete the entry type
							entryType.remove(function(err) {
								if (err) {
									res.status(500).json(err);
								}

								//Success!
								res.status.send("Success!");
							})
						})
					})
				})
			})

		})
	}, function(error) {
		res.status(error.status).send(error.message);
	});
});

module.exports = router;
