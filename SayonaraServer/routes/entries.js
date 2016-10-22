//Create our router
var express = require('express');
var router = express.Router();

//Helper functions
var routeHelpers = require('./routeHelpers');

// User models
var mongoose = require('mongoose');
var Entry = mongoose.model('Entry');
var EntryType = mongoose.model('EntryType');

//Create an Entry (Save Within it's Entry Type)
router.post('/create', function(req, res) {

	//Check for required fields
	if (!req.body || !req.body.title || !req.body.entryType) res.status(400).send('Missing parameters');

	//Validate our JWT and permissions
	var permissions = [routeHelpers.definedPermissions.entries];
	routeHelpers.validateUser(req, permissions).then(function(result) {

		//Update the entryType
		EntryType.findOne({
			_id: req.body.entryType
		}, function(err, entryType) {
			if (err) {
				res.status(500).send('Error saving the category.');
				return;
			}
			if (!entryType) res.status(404).send('Entry Type not Found');

			//Perform the action
			//Create a new page
			var newEntry = new Entry({
				title: req.body.title,
				entryType: req.body.entryType
			});

			//Check for optional parameters
			if (req.body.date) newEntry.date = req.body.date;
			if (req.body.content) newEntry.content = req.body.content;
			if (req.body.embedCodes) newEntry.embedCodes = req.body.embedCodes;
			if (req.body.uploadUrls) newEntry.uploadUrls = req.body.uploadUrls;
			if (req.body.categories) newEntry.categories = req.body.categories;

			//Save the new entry
			newEntry.save(function(err) {
				if (err) {
					res.status(500).send('Error saving the category.');
				}

				//push the entry onto the entrytype
				entryTypes.entries.push(newEntry.id);
				entryType.save(function(err) {
					if (err) {
						res.status(500).send('Error saving the category.');
						return;
					}
					res.status(200).json(newEntry);
				})
			})
		})
	}, function(error) {
		res.status(error.status).send(error.message);
	});
});

//Get All Entries in an entry type
router.get('/type/:id', function(req, res) {
	//Validate our JWT and permissions
	var permissions = [routeHelpers.definedPermissions.pages];
	routeHelpers.validateUser(req, permissions).then(function(result) {

		//Find the Entry Type
		EntryType.findOne({
			_id: req.params.id
		}, function(err, entryType) {
			if (err) {
				res.status(500).json(err);
				return;
			}
			if (!entryType) res.status(404).send('Entry Type not Found');

			Entry.find({
					entryType: req.params.id
				},
				function(err, entries) {
					if (err) {
						res.status(500).json(err);
						return;
					}
					if (!entries) res.status(404).send('Entries of the entry type not found');

					//Return the entries
					res.status(200).json(entries);

				});
		});
	}, function(error) {
		res.status(error.status).send(error.message);
	});
});

//Get An Entry (Including it's categories)

//Update an entry

//Delete an entry

module.exports = router;
ts = router;
