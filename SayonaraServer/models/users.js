//Mongoose schemas for users and their permissions
var permSchema = new Schema({
	entries: {
		type: Boolean,
		default: true
	},
	pages: {
		type: Boolean,
		default: true
	},
	admin: {
		type: Boolean,
		default: true
	}
});

var userSchema = new Schema({
	email: {
		type: String,
		required: true
	},
	password: {
		type: String,
		required: true
	},
	permissions: permSchema
});

//Models
var perm = mongoose.model('Permissions', permSchema);
var user = mongoose.model('User', userSchema);

module.exports = {
	userModel: user,
	permModel: perm
};
