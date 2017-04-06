//Create our router
var express = require('express');
var router = express.Router();

//Helper functions
var routeHelpers = require('./routeHelpers');

//Promise
var Promise = require('promise');

// User models
var mongoose = require('mongoose');
var CustomFieldType = mongoose.model('CustomFieldType');
var EntryType = mongoose.model('EntryType');

//Create CustomFieldTypes
router.post('/create', function(req, res) {

	//Check for required fields
	if (!req.body || !req.body.title) res.status(400).send('Missing parameters');

	//Validate our JWT and permissions
	var permissions = [routeHelpers.definedPermissions.admin];
	routeHelpers.validateUser(req, permissions).then(function(result) {

		//Perform the action
		//Create a new page
		var newCustomFieldType = new CustomFieldType({
			title: req.body.title,
      description: req.body.description,
		});

		//Save the new entry
		newCustomFieldType.save(function(err) {
			if (err) {
				res.status(500).send('Error saving the Custom Field Type.');
				return;
			}

			//Save the new entry type
			res.status(200).json(newCustomFieldType);
		});
	}, function(error) {
		res.status(error.status).send(error.message);
	});
});

// GET Done in Settings route (admin.js)

//Update a customFieldTypes
router.put('/id/:id', function(req, res) {

	//Check for required fields
	if (!req.body || (!req.body.title)) res.status(400).send('Missing parameters');

	//Validate our JWT and permissions
	var permissions = [routeHelpers.definedPermissions.admin];
	routeHelpers.validateUser(req, permissions).then(function(result) {

		//Perform the action
		//Find the category
		CustomFieldType.findOne({
			_id: req.params.id
		}, function(err, customFieldType) {
			if (err) {
				res.status(500).send('Error finding the category.');
			}
			if (!customFieldType) res.status(404).send('Id not found');

			//Add the new parameters
			if (req.body.title) customFieldType.title = req.body.title;
      if (req.body.description) customFieldType.description = req.body.description;

			customFieldType.save(function(err) {
				if (err) {
					res.status(500).send('Error saving the custom field type.');
					return;
				}
				//Respond success
				res.status(200).json(customFieldType);
			})


		});
	}, function(error) {
		res.status(error.status).send(error.message);
	});
});

//Delete a category
router.delete('/id/:id', function(req, res) {

	//Validate our JWT and permissions
	var permissions = [routeHelpers.definedPermissions.admin];
	routeHelpers.validateUser(req, permissions).then(function(result) {

		//Perform the action
		//Find the CustomFieldType
		CustomFieldType.findOne({
			_id: req.params.id
		}, function(err, customFieldType) {
			if (err) {
				res.status(500).send('Error finding the custom field type.');
				return;
			}
			if (!customFieldType) {
				res.status(404).send('Id not found');
				return;
			}

			//Declare our array of clean up promises
			var cleanUpPromises = [];

			//First Delete all references to the object
			EntryType.find({
					customFieldTypes: customFieldType.id
				},
				function(err, entryTypes) {
					if (err) {
						res.status(500).send('Error finding the entries to clean up.');
					}
					if (entryTypes && entryTypes.length > 0) {
						//Remove the customFieldType from all of the entryTypes
						entryTypes.forEach(function(entryType) {
							cleanUpPromises.push(new Promise(function(resolve) {
								entryType.customFieldType.splice(entry.customFieldType.indexOf(customFieldType.id), 1);
								//Save the entries
								entryType.save(function(err) {
									if (err) {
										res.status(500).send('Error saving the updated entryTypes on customFieldType delete.');
										return;
									}
									resolve();
								});
							}));
						});
					}

          //Once our cleanup promise resolves, delete the category
          Promise.all(cleanUpPromises).then(function() {
            //Finally Delete the category
            customFieldType.remove(function(err) {
              if (err) {
                res.status(500).send('Error removing the customFieldType.');
                return;
              }
              //Respond success
              res.status(200).send('Success!');
            });
          });
				});
			});
	}, function(error) {
		res.status(error.status).send(error.message);
	});
});


module.exports = router;
