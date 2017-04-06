//Mongoose schemas for Custom Fields
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var customFieldTypeSchema = new Schema({
	title: {
		type: String,
		required: true
	},
  description: {
		type: String,
		required: true
	}
});

//Models
module.exports = mongoose.model('CustomFieldType', customFieldTypeSchema);
