//Mongoose schemas for Custom Fields
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var customFields = new Schema({
	entry: {
		type: Schema.Types.ObjectId,
		ref: 'Entry',
		required: true
	},
	customFieldType: {
		type: Schema.Types.ObjectId,
		ref: 'CustomFieldType',
		required: true
	},
  fields: [{
		type: String
	}]
});

//Models
module.exports = mongoose.model('CustomField', customFields);
