//Mongoose schemas for Entries
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var entrySchema = new Schema({
	title: {
		type: String,
		required: true
	},
	date: {
		type: Date,
		default: Date.now()
	},
	content: {
		type: String
	},
	embedCodes: [String],
	uploadUrls: [String],
	categories: [mongoose.Schema.Types.ObjectId]
});

//Models
module.exports = mongoose.model('Entry', entrySchema);
