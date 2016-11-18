//Mogoose schema for permissions
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var permSchema = new Schema({
	entries: {
		create: {
			type: Boolean,
			default: true
		},
		read: {
			type: Boolean,
			default: true
		},
		update: {
			type: Boolean,
			default: true
		},
		delete: {
			type: Boolean,
			default: true
		}
	},
	entryTypes: {
		create: {
			type: Boolean,
			default: true
		},
		read: {
			type: Boolean,
			default: true
		},
		update: {
			type: Boolean,
			default: true
		},
		delete: {
			type: Boolean,
			default: true
		}
	},
	pages: {
		create: {
			type: Boolean,
			default: true
		},
		read: {
			type: Boolean,
			default: true
		},
		update: {
			type: Boolean,
			default: true
		},
		delete: {
			type: Boolean,
			default: true
		}
	},
	admin: {
		type: Boolean,
		default: true
	}
});

module.exports = mongoose.model('Permissions', permSchema);
