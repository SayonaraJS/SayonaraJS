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
										entry: newEntry.id,
										customFieldType: customField.customFieldTypeId,
										fields: customField.fields
									});

									//Save the new custom field
									newCustomField.save(function(err) {
										if (err) {
											res.status(500).send('Error saving the custom field: ' + customField.customFieldTypeId);
											return;
										}

										resolve();
									});
								}));
							}
						});
					}

				// Finally, return 200 after custom fields
				Promise.all(customFieldPromises).then(function() {
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
		}).exec(function(err, entry) {
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
		Entry.findOne({ _id: req.params.id }).exec(function(err, entry) {
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

			//Create a promise for checking/changing entry types
			var entryTypePromise = new Promise(function(resolve) {
				if (req.body.entryType) {
					if(req.body.entryType != entry.entryType) {
						//First, ensure the new Entry type exists
						EntryType
						.findOne({_id: req.body.entryType})
						.populate('entries')
						.exec(function(err, newEntryType) {
							if (err) {
								res.status(500).send('Error finding the entry\'s new entry type.');
								return;
							}
							if(newEntryType) {
								//Save the old entry type, and set the new entry type
								//TODO: Fix the entry.entryType id not updating
								console.log(entry);
								var oldEntryTypeId = entry.entryType;
								entry.entryType = newEntryType._id;
								console.log(entry);

								//Add to the new entry type
								console.log(newEntryType);
								newEntryType.entries.push(entry);
								console.log(newEntryType);
								newEntryType.update(function(err) {
									if (err) {
										console.log(err);
										res.status(500).send('Error saving the new entry type.');
										return;
									}

									//Remove from the previous entrytype
									//Find the old Entry Type
									EntryType
									.findOne({ _id: oldEntryTypeId })
									.populate('entries')
									.exec(function(err, oldEntryType) {
										if (err) {
											res.status(500).send('Error finding the entry\'s old entry type.');
											return;
										}
										if(oldEntryType) {
											//Get a reference to the length of the entries
											var entryLength = oldEntryType.entries.length;

											//Find the entry in the entry type
											for(var i = 0; i < oldEntryType.entries.length; i++) {
												if(entry._id.equals(oldEntryType.entries[i]._id)) {
													oldEntryType.entries.splice(i, 1);
												}
											}

											//Check if we spliced an entry out, if we did, save
											if(oldEntryType.entries.length < entryLength) {
												//Save the old entry type
												oldEntryType.update(function(err) {
													if (err) {
														res.status(500).send('Error saving the old entry type.');
														return;
													}

													//Also, we need to delete all of the customFieldTypes
													// Delete all of the custom fields associated with the entry
													var customFieldTypePromises = [];
													CustomField.find({
														entry: entry._id
													}, function(err, customFields) {
														if (err) {
															res.status(500).json(err);
															return;
														}
														if(!customFields) {
															// We have no customFields
															// Finally, resolve the change of entry types
															customFieldTypePromises.push(new Promise(function(resolve) {
																resolve();
															}));
														} else {
															//Loop Through all entries to be deleted
															if(customFields && customFields.length > 0) {
																customFields.forEach(function(customField) {
																	customFieldTypePromises.push(new Promise(function(resolve) {
																		customField.remove(function(err) {
																			if (err) {
																				res.status(500).json(err);
																				return;
																			}
																			resolve();
																		});
																	}));
																});
															}
														}

														//Once all clean up promises resolve
														Promise.all(customFieldTypePromises).then(function() {
															//Finally, Remove the entry
															entry.remove(function(err) {
																if (err) {
																	res.status(500).json(err);
																	return;
																}
																// Finally, resolve the change of entry types
																resolve(true);
															});
														});
													});
												});
											} else resolve();
										} else resolve();
									});
								});
							} else resolve();
						});
					} else resolve();
				} else resolve();
			});

			//Save the entry after checking entry types
			entryTypePromise.then(function(didChangeEntryType) {
				entry.save(function(err) {
					if (err) {
						res.status(500).send('Error saving the entry.');
						return;
					}

					//Lastly, update the entries customFields
					// Handle custom fields
					var customFieldPromises = [];
					if (!didChangeEntryType &&
						req.body.customFields &&
						req.body.customFields.length > 0) {
						// Create Custom fields with the appropriate id and things
						req.body.customFields.forEach(function(customField) {
							//Ensure we have a valid custom field
							if(customField &&
								customField.customFieldId &&
								customField.fields &&
								customField.fields.length > 0) {
									//Create a new promise to create/save the field
								customFieldPromises.push(new Promise(function(resolve) {
									CustomField.findOne({_id: customField.customFieldId})
									.exec(function(err, foundCustomField) {
										if (err) {
											res.status(500).send('Error, could not find the custom field: ' + customField.customFieldId);
											return;
										}

										// Update the customField's fields
										foundCustomField.fields = customField.fields

										foundCustomField.save(function(err) {
											if (err) {
												res.status(500).send('Error saving the customField: ' + customField.customFieldId);
												return;
											}

											resolve();
										});
									});
								}));
							}
						});
					}

					// Finally, return 200 after custom fields
					Promise.all(customFieldPromises).then(function() {
						res.status(200).json();
					});
				});
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
					var cleanUpPromises = [];
					CustomField.find({
						entry: entry._id
					}, function(err, customFields) {
						if (err) {
							res.status(500).json(err);
						}
						if(!customFields) {
							// We have no customFields
							cleanUpPromises.push(new Promise(function(resolve) {
								resolve();
							}));
						} else {
							//Loop Through all entries to be deleted
							if(customFields && customFields.length > 0) {
								customFields.forEach(function(customField) {
									cleanUpPromises.push(new Promise(function(resolve) {
										customField.remove(function(err) {
											if (err) {
												res.status(500).json(err);
											}
											resolve();
										});
									}));
								});
							}
						}

						//Once all clean up promises resolve
						Promise.all(cleanUpPromises).then(function() {
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
		});
	}, function(error) {
		res.status(error.status).send(error.message);
	});
});

module.exports = router;
