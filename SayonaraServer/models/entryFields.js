//Mongoose schemas for Entry Types
//Ensure to keep Entry types "fields" aligned with Content fields
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var entrySchema = require('./entries');

var entryFieldSchema = new Schema({
	content: {
		type: Boolean,
		default: true
	},
	embedCodes: {
		type: Boolean,
		default: false
	},
	uploadUrls: {
		type: Boolean,
		default: false
	}
});

//Models
module.exports = mongoose.model('EntryField', entryFieldSchema);
