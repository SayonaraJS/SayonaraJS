//Mongoose schemas for Entry Types
//Ensure to keep Entry types "fields" aligned with Content fields
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var entryTypeSchema = new Schema({
	title: {
		type: String,
		required: true
	},
	entries: [mongoose.Schema.Types.ObjectId],
	fields: {
		type: mongoose.Schema.Types.ObjectId,
		required: true
	}
});

//Models
module.exports = mongoose.model('EntryType', entryTypeSchema);
