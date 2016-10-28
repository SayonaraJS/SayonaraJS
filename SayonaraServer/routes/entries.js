//Create our router
var express = require('express');
var router = express.Router();

//Helper functions
var routeHelpers = require('./routeHelpers');

// User models
var mongoose = require('mongoose');
var Category = mongoose.model('Category');
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
				res.status(500).send('Error finding the entry type.');
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
					res.status(500).send('Error saving the entry.');
				}

				//push the entry onto the entrytype
				entryTypes.entries.push(newEntry.id);
				entryType.save(function(err) {
					if (err) {
						res.status(500).send('Error saving the entry type');
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

//Get all Entries
//Not Authenticated since used by public website
router.get('/all', function(req, res) {
	//Find all pages
	Entry.find({}).populate('categories').exec(function(err, entries) {
		if (err) {
			res.status(500).json(err);
			return;
		}

		//Return the pages
		res.send(entries);
	});
});

//Get An Entry (Including it's categories)
router.get('/id/:id', function(req, res) {

	//Validate our JWT and permissions
	var permissions = [routeHelpers.definedPermissions.entries];
	routeHelpers.validateUser(req, permissions).then(function(result) {

		//Find the Entry
		Entry.findOne({
			_id: req.params.id
		}).populate('categories').exec(function(err, entry) {
			if (err) {
				res.status(500).json(err);
				return;
			}
			if (!entry) res.status(404).send('Entry Type not Found');

			//Return the entry
			res.status(200).json(entry);
		});
	}, function(error) {
		res.status(error.status).send(error.message);
	});
});

//Update an entry
router.put('/id/:id', function(req, res) {

	//Check for required fields
	if (!req.body) res.status(400).send('Missing parameters');

	//Validate our JWT and permissions
	var permissions = [routeHelpers.definedPermissions.entries];
	routeHelpers.validateUser(req, permissions).then(function(result) {

		//Find the entry
		Entry.findOne({
			_id: req.params.id
		}, function(err, entry) {
			if (err) {
				res.status(500).send('Error finding the entry.');
				return;
			}
			if (!entry) res.status(404).send('Entry not Found');

			//Update fields of the entry
			if (req.body.title) entry.title = req.body.title;
			if (req.body.date) entry.date = req.body.date;
			if (req.body.content) entry.content = req.body.content;
			if (req.body.embedCodes) entry.embedCodes = req.body.embedCodes;
			if (req.body.uploadUrls) entry.uploadUrls = req.body.uploadUrls;
			if (req.body.categories) entry.categories = req.body.categories;

			entry.save(function(err) {
				if (err) {
					res.status(500).send('Error saving the entry.');
					return;
				}
				res.status(200).json(entry);
			});
		})
	}, function(error) {
		res.status(error.status).send(error.message);
	});
});

//TODO: Upload a file, and update an entry

//Delete an entry
router.delete('/id/:id', function(req, res) {

	//Check for required fields
	if (!req.body) res.status(400).send('Missing parameters');

	//Validate our JWT and permissions
	var permissions = [routeHelpers.definedPermissions.entries];
	routeHelpers.validateUser(req, permissions).then(function(result) {

		//Get the entry
		Entry.findOne({
			_id: req.params.id
		}, function(err, entry) {
			if (err) {
				res.status(500).json(err);
				return;
			}
			if (!entry) res.status(404).send('Entry not Found');

			//Remove the entry from the entry type
			entryType.splice(entryType.indexOf(entry.id), 1);

			//Save the entry type
			entryType.save(function(err) {
				if (err) {
					res.status(500).json(err);
					return;
				}

				//Remove the entry
				entry.remove(function(err) {
					if (err) {
						res.status(500).json(err);
						return;
					}
					res.status(200).send('Successful!');
				});
			});
		});
	}, function(error) {
		res.status(error.status).send(error.message);
	});
});

module.exports = router;
