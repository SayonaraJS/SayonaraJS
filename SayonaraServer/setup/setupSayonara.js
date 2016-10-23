//Sayonara Config
var sayonaraConfig = require('../sayonaraConfig');

//Mongoose schemas for users
var mongoose = require('mongoose');
var SayonoaraSetup = mongoose.model('SayonaraSetup');

var path = require('path');

//Try to find if the DB has been intialized
module.exports = function(app, callback) {

	SayonoaraSetup.findOne({}, function(err, setup) {
		if (err) {
			console.log('Error when trying to set up Sayonara');
			return;
		}

		if (!setup || !setup.setupRun) {
			console.log('setup not run!');
			//Make the index of the app the setup file
			app.get(/^(?!\/setupsayonara).*/, function(req, res) {
				res.sendFile(path.resolve('./setup/setupClient.html'));
			});

			//Also, accept post request to setu thedeb
			app.post('/setupsayonara', function(req, res) {
				console.log('hi!');
				res.status(200).send('Success!');
			});


		} else {
			//Make the index of the app the client
			var clientRoot = sayonaraConfig.clientRoot;
			if (setup.client) clientRoot = setup.client;

			//Relative paths for the admin app
			//Regex for match everything except /admin* and /api*
			app.get(/^(?!\/admin|\/api).*/, function(req, res) {
				var pathString = clientRoot + req.url;
				res.sendFile(path.resolve(pathString));
			});
		}

		//Finally run our callback
		callback(app);
	})
}
