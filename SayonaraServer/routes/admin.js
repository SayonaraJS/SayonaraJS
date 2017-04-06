//Route for all settings/administrative, such as creating entry types, getting all entry types and categories, etc...

//Create our router
var express = require('express');
var router = express.Router();

//Helper functions
var routeHelpers = require('./routeHelpers');

// User models
var mongoose = require('mongoose');
var CustomFieldType = mongoose.model('CustomFieldType');
var Category = mongoose.model('Category');
var Entry = mongoose.model('Entry');
var EntryType = mongoose.model('EntryType');

//Get all Entry types, categories, and customFields (useful for when editing entries and pages)
router.get('/settings', function(req, res) {
	//Validate our JWT and permissions
	var permissions = [routeHelpers.definedPermissions.entries, routeHelpers.definedPermissions.pages];
	routeHelpers.validateUser(req, permissions).then(function(result) {

		//Find all Entry types
		EntryType.find({}).exec(function(err, entryTypes) {
			if (err) {
				res.status(500).json(err);
			}

            //Find all categories
            Category.find({}).exec(function(err, categories) {
                if (err) {
    							res.status(500).json(err);
    						}

								//Find all categories
		            CustomFieldType.find({}).exec(function(err, customFieldTypes) {
		                if (err) {
		    							res.status(500).json(err);
		    						}

		                res.send({
		                    entryTypes: entryTypes,
		                    categories: categories,
												customFieldTypes: customFieldTypes
		                });
		            });
            });
		});
	}, function(error) {
		res.status(error.status).send(error.message);
	});
});

module.exports = router;
