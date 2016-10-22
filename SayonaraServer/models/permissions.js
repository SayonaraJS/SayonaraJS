//Mogoose schema for permissions
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var permSchema = new Schema({
	entries: {
		type: Boolean,
		default: true
	},
	pages: {
		type: Boolean,
		default: true
	},
	admin: {
		type: Boolean,
		default: true
	}
});

module.exports = mongoose.model('Permissions', permSchema);
