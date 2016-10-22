//Mongoose schemas for users
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var permSchema = require('./permissions');

var userSchema = new Schema({
	email: {
		type: String,
		required: true
	},
	hash: {
		type: String,
		required: true
	},
	permissions: {
		type: mongoose.Schema.Types.ObjectId,
		required: true
	}
});

//Models
module.exports = mongoose.model('User', userSchema);
