//Mongoose schemas for Custom Fields
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var customFields = new Schema({
	customFieldType: {
		type: Schema.Types.ObjectId,
		ref: 'CustomFieldType',
		required: true
	},
  fields: [{
		type: String,
		required: true
	}]
});

//Models
module.exports = mongoose.model('CustomField', customFields);
