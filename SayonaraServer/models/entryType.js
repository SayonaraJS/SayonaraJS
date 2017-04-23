//Mongoose schemas for Entry Types
//Ensure to keep Entry types "fields" aligned with Content fields
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var entryTypeSchema = new Schema({
	title: {
		type: String,
		required: true
	},
	description: {
		type: String
	},
	entries: [{
		type: Schema.Types.ObjectId,
		ref: 'Entry'
	}],
	order: {
		type: Number,
		default: 0
	},
	hasContent: {
		type: Boolean,
		default: true
	},
	customFieldTypes: [{
		type: Schema.Types.ObjectId,
		ref: 'CustomFieldType'
	}],
});

//Models
module.exports = mongoose.model('EntryType', entryTypeSchema);
