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
	entryTypes: [mongoose.Schema.Types.ObjectId],
	categories: [mongoose.Schema.Types.ObjectId]
});

//Models
module.exports = mongoose.model('Page', pagesSchema);
