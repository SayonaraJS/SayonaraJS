//Create our router
var express = require('express');
var router = express.Router();

//Helper functions
var routeHelpers = require('./routeHelpers');

//Promise
var Promise = require('promise');

// User models
var mongoose = require('mongoose');
var Entry = mongoose.model('Entry');
var EntryType = mongoose.model('EntryType');
var Page = mongoose.model('Page');

//Create Entry Types
router.post('/create', function(req, res) {

	//Check for required fields
	if (!req.body || !req.body.title) res.status(400).send('Missing parameters');

	//Validate our JWT and permissions
	var permissions = [];
	routeHelpers.validateUser(req, permissions).then(function(result) {

		//Perform the action
		//Create a new page
		var newEntryType = new EntryType({
			title: req.body.title
		});

		//Check for optional parameters
		//Booleans if the fields are enabled
		if (req.body.order) newEntryType.order = req.body.order;
		if (req.body.hasContent) newEntryType.hasContent = req.body.hasContent;
		if (req.body.hasEmbedCodes) newEntryType.hasEmbedCodes = req.body.hasEmbedCodes;
		if (req.body.hasUploadUrls) newEntryType.hasUploadUrls = req.body.hasUploadUrls;

		//Save the new entry
		newEntryType.save(function(err) {
			if (err) {
				res.status(500).send('Error saving the Entry Type.');
				return;
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

		//Populate if requested
		var populateString = '';
		if(req.headers && req.headers['populate']) populateString = 'entries';

		//Find all EntryTypes
		EntryType.find({}).populate({
			path: populateString,
			options: {
				sort: {
					order: 1
				}
			}
		}).sort('order').exec(function(err, entryTypes) {
			if (err) {
				res.status(500).json(err);
			}

			res.send(entryTypes);
		});
	}, function(error) {
		res.status(error.status).send(error.message);
	});
});

//Get All Entries in an entry type
router.get('id/:id/allentries', function(req, res) {
	//Validate our JWT and permissions
	var permissions = [routeHelpers.definedPermissions.entryType, routeHelpers.definedPermissions.entries];
	routeHelpers.validateUser(req, permissions).then(function(result) {

		//Find the Entry Type
		EntryType.findOne({
			_id: req.params.id
		}).populate('entries entries.categories').exec(function(err, entryType) {
			if (err) {
				res.status(500).json(err);
				return;
			}
			if (!entryType) res.status(404).send('Entry Type not Found');

			//Return the entries
			res.status(200).json(entryType);
		});
	}, function(error) {
		res.status(error.status).send(error.message);
	});
});

//Update an entryType
router.put('/id/:id', function(req, res) {

	//Check for required fields
	if (!req.body) res.status(400).send('Missing parameters');

	//Validate our JWT and permissions
	var permissions = [routeHelpers.definedPermissions.entries, routeHelpers.definedPermissions.entryType];
	routeHelpers.validateUser(req, permissions).then(function(result) {

		//Get the entryType
		EntryType.findOne({
			_id: req.params.id
		}, function(err, entryType) {
			if (err) {
				res.status(500).json(err);
				return;
			}
			if (!entryType) {
				res.status(404).send('Item Not Found');
				return;
			}

			//Check for optional parameters
			if (req.body.title) entryType.title = req.body.title;
			if (req.body.order) entryType.order = req.body.order;
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
			_id: req.params.id
		}, function(err, entryType) {
			if (err) {
				res.status(500).json(err);
				return;
			}
			if (!entryType) {
				res.status(404).send('Item Not Found');
				return;
			}

			//Create an array of our cleanup promises
			var cleanUpPromises = [];

			//Find All pages associated with the entry type
			Page.find({
				entryTypes: entryType._id
			}, function(err, pages) {
				if (err) {
					res.status(500).json(err);
				}

				if(pages && pages.length > 0) {

					//Remove the reference to the entry field from the pages
					pages.forEach(function(page) {
						cleanUpPromises.push(new Promise(function(resolve) {
							page.entryTypes.splice(page.entryTypes.indexOf(entryType.id), 1);
							page.save(function(err) {
								if (err) {
									res.status(500).json(err);
								}
								resolve();
							})
						}));
					});
				}

				//Find All Entries associate with the entry field
				Entry.find({
					entryType: entryType._id
				}, function(err, entries) {
					if (err) {
						res.status(500).json(err);
					}

					//Loop Through all entries to be deleted
					if(entries && entries.length > 0) {
						entries.forEach(function(entry) {
							cleanUpPromises.push(new Promise(function(resolve) {
								entry.remove(function(err) {
									if (err) {
										res.status(500).json(err);
									}
									resolve();
								});
							}));
						});
					}

					//Once all clean up promises resolve
					Promise.all(cleanUpPromises).then(function() {
						//Finally delete the entry type
						entryType.remove(function(err) {
							if (err) {
								res.status(500).json(err);
							}

							//Success!
							res.status(200).send("Success!");
						});
					});
				});
			})

		})
	}, function(error) {
		res.status(error.status).send(error.message);
	});
});

module.exports = router;
