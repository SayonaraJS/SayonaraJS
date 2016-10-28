//Mongoose schemas for Entry Types
//Ensure to keep Entry types "fields" aligned with Content fields
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var pagesSchema = new Schema({
	title: {
		type: String,
		required: true
	},
	date: {
		type: Date,
		default: Date.now()
	},
	content: {
		type: String,
		default: '<h1>Sayonara, New Page</h1>'
	},
	entryTypes: [{
		type: Schema.Types.ObjectId,
		ref: 'EntryType'
	}],
	categories: [{
		type: Schema.Types.ObjectId,
		ref: 'Category'
	}]
});

//Models
module.exports = mongoose.model('Page', pagesSchema);
