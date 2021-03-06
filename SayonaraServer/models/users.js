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
	dateJoined: {
		type: Date,
		default: Date.now
	},
	permissions: {
		type: Schema.Types.ObjectId,
		ref: 'Permissions',
		required: true
	}
});

//Models
module.exports = mongoose.model('User', userSchema);
