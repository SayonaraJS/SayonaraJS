//Create our router
var express = require('express');
var router = express.Router();

//Promise (for entry type updating)
var Promise = require('promise');

//Helper functions
var routeHelpers = require('./routeHelpers');

// User models
var mongoose = require('mongoose');
var Category = mongoose.model('Category');
var CustomField = mongoose.model('CustomField');
var CustomFieldType = mongoose.model('CustomFieldType');
var Entry = mongoose.model('Entry');
var EntryType = mongoose.model('EntryType');

//Create an Entry (Save Within it's Entry Type)
router.post('/create', function(req, res) {

	//Check for required fields
	if (!req.body || !req.body.title || !req.body.entryType) {
		res.status(400).send('Missing parameters');
		return;
	}

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
			if (req.body.order) newEntry.order = req.body.order;
			if (req.body.embedCodes) newEntry.embedCodes = req.body.embedCodes;
			if (req.body.uploadUrls) newEntry.uploadUrls = req.body.uploadUrls;
			if (req.body.categories) newEntry.categories = req.body.categories;

			// Handle custom fields
			var customFieldPromises = [];
			if (req.body.customFields) {
				// Create Custom fields with the appropriate id and things
				req.body.customFields.forEach(function(customField) {
					//Ensure we have a valid custom field
					if(customField &&
						customField.customFieldTypeId &&
						customField.fields &&
						customField.fields.length > 0) {
							//Create a new promise to create/save the field
						customFieldPromises.push(new Promise(function(resolve) {
							var newCustomField = new CustomField({
								customFieldType: customField.customFieldTypeId,
								fields: customField.fields
							});

							//Save the new custom field
							newCustomField.save(function(err) {
								if (err) {
									res.status(500).send('Error saving the custom field: ' + customField.customFieldTypeId);
									return;
								}

								// Add the custom fields to the new entry
								newEntry.customFields.push(newCustomField);
								resolve();
							});
						}));
					}
				});
			}

			// Finally, return 200 after custom fields
			Promise.all(customFieldPromises).then(function() {
				//Save the new entry
				newEntry.save(function(err) {
					if (err) {
						res.status(500).send('Error saving the entry.');
					}

					//push the entry onto the entrytype
					entryType.entries.push(newEntry.id);
					entryType.save(function(err) {
						if (err) {
							res.status(500).send('Error saving the entry type');
							return;
						}
						// Respond with success
						res.status(200).json(newEntry);
				});
			});
		});
	});
	}, function(error) {
		res.status(error.status).send(error.message);
	});
});

//Get all Entries
//Not Authenticated since used by public website
router.get('/all', function(req, res) {
	//Find all pages
	Entry.find({}).populate('categories entryType').sort('order')
		.exec(function(err, entries) {
		if (err) {
			res.status(500).json(err);
			return;
		}

		//Return the entries
		res.send(entries);
	});
});

//Get An Entry
router.get('/id/:id', function(req, res) {
	//Validate our JWT and permissions
	var permissions = [routeHelpers.definedPermissions.entries];
	routeHelpers.validateUser(req, permissions).then(function(result) {

		//Find the Entry
		Entry.findOne({
			_id: req.params.id
		}).populate('customFields')
		.populate({
			path: 'entryType',
			model: 'EntryType',
			populate: {
				path: 'customFieldTypes',
				model: 'CustomFieldType'
			}
		})
		.exec(function(err, entry) {
			if (err) {
				res.status(500).json(err);
				return;
			}
			if (!entry) res.status(404).send('Entry not Found');

			// Also, grab our custom fields


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
		Entry.findOne({ _id: req.params.id })
		.exec(function(err, entry) {
			if (err) {
				res.status(500).send('Error finding the entry.');
				return;
			}
			if (!entry) res.status(404).send('Entry not Found');

			//Update fields of the entry
			if (req.body.title) entry.title = req.body.title;
			if (req.body.date) entry.date = req.body.date;
			if (req.body.content) entry.content = req.body.content;
			if (req.body.order) entry.order = req.body.order;
			if (req.body.embedCodes) entry.embedCodes = req.body.embedCodes;
			if (req.body.uploadUrls) entry.uploadUrls = req.body.uploadUrls;
			if (req.body.categories) entry.categories = req.body.categories;

			//Check if we changed entryTypes
			var entryTypeChanged = false;
			if (req.body.entryType &&
					req.body.entryType._id != entry.entryType) {
				entryTypeChanged = true;
			}

			// Promise for entry type changes
			var entryTypePromise = new Promise(function(resolve, reject) {
				if (!entryTypeChanged) {
					//Simply resolve
					resolve();
				} else {
					// Check if the new entry type exists
					EntryType.findOne({ _id: req.body.entryType })
					.exec(function(err, newEntryType) {
						// Check for errors
						if(err) {
							reject({
								status: 500,
								message: 'Error finding the entryType.'
							});
							return;
						}
						if(!newEntryType) {
							reject({
								status: 500,
								message: 'Error finding the entryType.'
							});
							return;
						}

						// Set our entries entryType to the new entry type
						var oldEntryTypeId = entry.entryType.toString().slice(0);
						entry.entryType = newEntryType._id;

						// Delete our old custom fields (as they are determined by entry type)
						CustomField.remove({
							_id: {
								$in: entry.customFields
							}
						}, function(err) {
							if(err) {
								reject({
									status: 500,
									message: 'Could not remove the entry\'s custom fields'
								});
								return;
							}

							// Remove the custom fields from the entry
							entry.customFields = [];

							//Save the entry
							entry.save(function(err) {
								if(err) {
									reject({
										status: 500,
										message: 'Could not save the entry'
									});
									return;
								}

								// Add the entry to the new entry type
								newEntryType.entries.push(entry);
								newEntryType.save(function(err) {
									if(err) {
										reject({
											status: 500,
											message: 'Could not save the new entry type'
										});
										return;
									}

									// Remove the entry from the old entry type
									EntryType.findOne({ _id: oldEntryTypeId })
									.exec(function(err, oldEntryType) {
										oldEntryType.entries.some(function(foundEntry, index) {
											if(foundEntry == entry._id.toString()) {
												// Remove the entry
												oldEntryType.entries.splice(index, 1);
												return true;
											}
											return false;
										});

										// Save the old entry type
										oldEntryType.save(function(err) {
											if(err) {
												reject({
													status: 500,
													message: 'Could not save the old entry type'
												});
												return;
											}

											//Finally, resolve
											resolve();
										});
									});
								});
							});
					});
				});
			}
		});

		// After we have finished our entrytype promise, check customFields
		entryTypePromise.then(function() {
			//Next check if we have customFields
			var customFieldsPromise = new Promise(function(resolve, reject) {
				// Check if we have customFields, or if we changed entry types
				// If we changed entry types, then the custom fields will be
				// deleted
				if(!req.body.customFields ||
					entryTypeChanged) {
					//Simply resolve
					resolve();
				} else {
					// Save a copy of the original entry customFields (Used later for updating)
					var originalEntryCustomFields = entry.customFields.slice()
					// Promises for actions
					var actionPromises = [];

					// DELETE, first delete entry
					entry.customFields.forEach((entryCustomField) => {
						var isInRequest = false;
						req.body.customFields.some((reqCustomField) => {
							if(reqCustomField._id &&
								reqCustomField._id == entryCustomField) {
								isInRequest = true;
								return true;
							}
							return false;
						});

						if(!isInRequest) {
							actionPromises.push(new Promise(function(delResolve, delReject) {
								// Delete the custom field
								CustomField.remove({ _id: entryCustomField })
								.exec(function(err) {
									if(err) {
										delReject({
											status: 500,
											message: "Could not find the custom field to delete"
										});
										return;
									}
									entry.customFields.splice(entry.customFields.indexOf(entryCustomField), 1);
									delResolve();
								});
							}));
						}
					});

					// CREATE new custom fields if they are not in the request
					req.body.customFields.forEach(function(reqCustomField) {
						if(!reqCustomField._id) {
							// The custom field does not exist, create it
							actionPromises.push(new Promise(function(createResolve, createReject) {
								//Ensure the custom field type exists
								CustomFieldType.findOne({ _id: reqCustomField.customFieldType })
								.exec(function(err, customFieldType) {
									if (err || !customFieldType) {
										createReject({
											status: 500,
											message: 'Could not find the new customFields customFieldType'
										});
										return;
									}

									// Create the custom field
									var newCustomField = new CustomField({
										customFieldType: customFieldType._id,
										fields: reqCustomField.fields
									});

									newCustomField.save(function(err) {
										if (err) {
											createReject({
												status: 500,
												message: 'Could not save the new custom field'
											});
											return;
										}

										// push the newCustomField onto the entry
										entry.customFields.push(newCustomField);
										createResolve();
									});
								});
							}));
						}
					});

					// UPDATE custom fields, Could be placed in above loop, but less readable
					req.body.customFields.forEach(function(reqCustomField) {
						// Loop through the original entry array, to avoid any race conditions
						originalEntryCustomFields.forEach(function(originalEntryCustomField) {
							if(reqCustomField._id &&
								reqCustomField._id == originalEntryCustomField) {
								actionPromises.push(new Promise(function(updateResolve, updateReject) {
									// Find the custom field from the DB
									CustomField.findOne({ _id: originalEntryCustomField })
									.exec(function(err, foundCustomField) {
										if (err) {
											updateReject({
												status: 500,
												message: 'Could not find the old custom field'
											});
											return;
										}
										if(!foundCustomField) {
											updateReject({
												status: 500,
												message: 'Custom field not found'
											});
											return;
										}

										// TODO: Deep equal check that the fields are not different

										// Update the custom field and save
										foundCustomField.fields = reqCustomField.fields;

										//Save the customField
										foundCustomField.save(function(err) {
											if (err) {
												updateReject({
													status: 500,
													message: 'Could not save the old custom field'
												});
												return;
											}
											//End of the updating field
											updateResolve();
										});
									});
								}));
							}
						});
					});

					// Finally save the entry after all promises for custom fields have finished
					Promise.all(actionPromises).then(function() {
						//Save the entry
						entry.save(function(err) {
							if (err) {
								res.status(500).json(err);
								return;
							}
							resolve();
						});
					}).catch(function(err) {
						reject(err);
						return;
					});
				}
			});

			customFieldsPromise.then(function() {
				// We successfully edited our entry!

				// Populate the custom fields
				entry.populate('customFields', function(err) {
					if (err) {
						res.status(500).json(err);
						return;
					}
					entry.populate({
						path: 'entryType',
						model: 'EntryType',
						populate: {
							path: 'customFieldTypes',
							model: 'CustomFieldType'
						}
					}, function(err) {
						if (err) {
							res.status(500).json(err);
							return;
						}

						// Respond with the populated entry
						res.status(200).json(entry);
					})
				})
			}).catch(function(err) {
				res.status(err.status).send(err.message);
				return;
			});
		}).catch(function() {
			res.status(err.status).send(err.message);
			return;
		});
	});
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

			//Find its entry type
			EntryType.findOne({_id: entry.entryType})
				.exec(function(err, entryType) {
				if (err) {
					res.status(500).json(err);
					return;
				}
				if (!entryType) res.status(404).send('Entry Type of Entry not Found');

				//Remove from the entry type
				entryType.entries.splice(entryType.entries.indexOf(entry.id), 1);

				//Save the entry type
				entryType.save(function(err) {
					if (err) {
						res.status(500).json(err);
						return;
					}

					// Delete all of the custom fields associated with the entry
					CustomField.remove({
						_id: {
							$in: entry.customFields
						}
					}, function(err) {
						if(err) {
							reject({
								status: 500,
								message: 'Could not remove the entry\'s custom fields'
							});
							return;
						}

						//Finally, Remove the entry
						entry.remove(function(err) {
							if (err) {
								res.status(500).json(err);
								return;
							}
							res.status(200).send('Successful!');
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
