//Mongoose schemas for users
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var catSchema = new Schema({
	title: {
		type: String,
		required: true
	}
});

//Models
module.exports = mongoose.model('Category', catSchema);
