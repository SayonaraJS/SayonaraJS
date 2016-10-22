//Create our router
var express = require('express');
var router = express.Router();

//Helper functions
var routeHelpers = require('./routeHelpers');

// User models
var mongoose = require('mongoose');
var Category = mongoose.model('Category');
var Entry = mongoose.model('Entry');

//Create a category
router.post('/create', function(req, res) {

	//Check for required fields
	if (!req.body || !req.body.title) res.status(400).send('Missing parameters');

	//Validate our JWT and permissions
	var permissions = [routeHelpers.definedPermissions.entries];
	routeHelpers.validateUser(req, permissions).then(function(result) {

		//Perform the action
		//Create a new page
		var newCategory = new Category({
			title: req.body.title
		});

		newCategory.save(function(err) {
			if (err) {
				res.status(500).send('Error saving the category.');
				return;
			}
			res.status(200).json(newCategory);
		})
	}, function(error) {
		res.status(error.status).send(error.message);
	});

});

//Get a category (Done on Entry Type)

//Update a category
router.put('/id/:id', function(req, res) {

	//Check for required fields
	if (!req.body || (!req.body.title)) res.status(400).send('Missing parameters');

	//Validate our JWT and permissions
	var permissions = [routeHelpers.definedPermissions.entries];
	routeHelpers.validateUser(req, permissions).then(function(result) {

		//Perform the action
		//Find the category
		Category.findOne({
			_id: req.params.id
		}, function(err, category) {
			if (err) {
				res.status(500).send('Error finding the category.');
			}
			if (!category) res.status(404).send('Id not found');

			//Add the new parameters
			if (req.body.title) category.title = req.body.title;

			category.save(function(err) {
				if (err) {
					res.status(500).send('Error saving the category.');
					return;
				}
				//Respond success
				res.status(200).json(category);
			})


		});
	}, function(error) {
		res.status(error.status).send(error.message);
	});

});

//Delete a category
//Update a category
router.delete('/id/:id', function(req, res) {

	//Check for required fields
	if (!req.body || (!req.body.title)) res.status(400).send('Missing parameters');

	//Validate our JWT and permissions
	var permissions = [routeHelpers.definedPermissions.entries];
	routeHelpers.validateUser(req, permissions).then(function(result) {

		//Perform the action
		//Find the category
		Category.findOne({
			_id: req.params.id
		}, function(err, category) {
			if (err) {
				res.status(500).send('Error finding the category.');
			}
			if (!category) res.status(404).send('Id not found');

			//First Delete all references to the object
			Entry.find({
					categories: category.id
				},
				function(err, entries) {

					if (entries) {
						//Remove the category from all of the entries
						entries.forEach(function(entry) {
							entry.splice(entry.indexOf(category.id), 1);
						});

						//Save the entries
						//TODO: Test once we have an entries route
						entries.save(function(err) {
							if (err) {
								res.status(500).send('Error saving the updated entries on category delete.');
								return;
							}
							//Finally Delete the category
							category.remove(function(err) {
								if (err) {
									res.status(500).send('Error saving the category.');
									return;
								}
								//Respond success
								res.status(200).send('Success!');
							});
						});
					} else {
						//Finally Delete the category
						category.remove(function(err) {
							if (err) {
								res.status(500).send('Error saving the category.');
								return;
							}
							//Respond success
							res.status(200).send('Success!');
						});
					}
				});
		});
	}, function(error) {
		res.status(error.status).send(error.message);
	});

});

module.exports = router;
