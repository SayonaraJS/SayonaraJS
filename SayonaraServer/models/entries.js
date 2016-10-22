//Mongoose schemas for Entries
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var entrySchema = new Schema({
	title: {
		type: String,
		required: true
	},
	entryType: {
		type: mongoose.Schema.Types.ObjectId,
		required: true
	},
	date: {
		type: Date,
		default: Date.now()
	},
	content: {
		type: String,
		default: '<h1>Sayonara, New Entry</h1>'
	},
	embedCodes: [String],
	uploadUrls: [String],
	categories: [mongoose.Schema.Types.ObjectId]
});

//Models
module.exports = mongoose.model('Entry', entrySchema);
