//Create our router
var express = require('express');
var router = express.Router();

//Helper functions
var routeHelpers = require('./routeHelpers');

//Promise
var Promise = require('promise');

// User models
var mongoose = require('mongoose');
var Category = mongoose.model('Category');
var Entry = mongoose.model('Entry');
var Page = mongoose.model('Page');

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

		if(req.body.description) newCategory.description = req.body.description;

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

// GET Done in Settings route (admin.js)

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
			if (req.body.description) category.description = req.body.description;

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
router.delete('/id/:id', function(req, res) {

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
				return;
			}
			if (!category) {
				res.status(404).send('Id not found');
				return;
			}

			//Declare our array of clean up promises
			var cleanUpPromises = [];

			//First Delete all references to the object
			Entry.find({
					categories: category.id
				},
				function(err, entries) {
					if (err) {
						res.status(500).send('Error finding the entries to clean up.');
					}
					if (entries && entries.length > 0) {
						//Remove the category from all of the entries
						entries.forEach(function(entry) {
							cleanUpPromises.push(new Promise(function(resolve) {
								entry.categories.splice(entry.categories.indexOf(category.id), 1);
								//Save the entries
								entry.save(function(err) {
									if (err) {
										res.status(500).send('Error saving the updated entries on category delete.');
										return;
									}
									resolve();
								});
							}));
						});
					}

					//Once all entrys have been cleaned, clean the pages
					Page.find({
							categories: category.id
						},
						function(err, pages) {
							if (err) {
								res.status(500).send('Error finding the pages to clean up.');
							}

							if (pages && pages.length > 0) {
								//Remove the category from all of the epages
								pages.forEach(function(page) {
									cleanUpPromises.push(new Promise(function(resolve) {
										page.categories.splice(page.categories.indexOf(category.id), 1);
										//Save the entries
										page.save(function(err) {
											if (err) {
												res.status(500).send('Error saving the updated entries on category delete.');
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
								category.remove(function(err) {
									if (err) {
										res.status(500).send('Error saving the category.');
										return;
									}
									//Respond success
									res.status(200).send('Success!');
								});
							});
					});
				});
			});
	}, function(error) {
		res.status(error.status).send(error.message);
	});
});

module.exports = router;
