//Create a mongoose schmea for if Sayanora has been configured
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var sayonaraSchema = new Schema({
	setupRun: {
		type: Boolean,
		required: true
	},
	date: {
		type: Date,
		default: Date.now()
	}
});

//Models
module.exports = mongoose.model('SayonaraSetup', sayonaraSchema);
