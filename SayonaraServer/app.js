//Require Common Express modules
var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var morgan = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var path = require('path');

//Declare our app
var app = express();

//CORS for cross-origin requests
var cors = require('cors');
app.use(cors());

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(morgan('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
	extended: true
}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'uploads')));

//Require our sayonaraConfig
var sayonaraConfig = require('./sayonaraConfig');

//Mongoose for MongoDB
var mongoose = require('mongoose');

//Models for mongoose
require('./setup/sayonaraSetupModel');
require('./models/permissions');
require('./models/users');
require('./models/categories');
require('./models/entries');
require('./models/entryType');
require('./models/pages');

//Our api routes
var appAuth = require('./routes/auth');
app.use('/api/auth', appAuth);
var appCategory = require('./routes/categories');
app.use('/api/category', appCategory);
var appEntry = require('./routes/entries');
app.use('/api/entry', appEntry);
var appEntryType = require('./routes/entryTypes');
app.use('/api/type', appEntryType);
var appPages = require('./routes/pages');
app.use('/api/pages', appPages);
var appAdmin = require('./routes/admin');
app.use('/api/admin', appAdmin);

//Connect to our DB
mongoose.connect(sayonaraConfig.dbUrl);
mongoose.connection.on('connected', function() {
	console.log('Mongoose connected to ' + sayonaraConfig.dbUrl);
});
mongoose.connection.on('disconnected', function() {
	console.log('Mongoose disconnected through ' + sayonaraConfig.dbUrl);
});

//Check if we need to setup
require('./setup/setupSayonara')(app, function(app) {
	//Callback to be run after sayonara is done setting up

	//Get our admin view
	// The Admin App Root
	app.get('/admin', function(req, res) {
		res.sendFile(path.resolve('../SayonaraAdmin/dist/index.html'));
	});
	//Relative paths for the admin app
	//Regex for /admin/[anything here]
	app.get(/(\/admin\/).*/, function(req, res) {
		var pathString = '../SayonaraAdmin/dist' + req.url.split('/admin')[1];
		res.sendFile(path.resolve(pathString));
	});

	// catch 404 and forward to error handler
	app.use(function(req, res, next) {
		var err = new Error('Not Found');
		err.status = 404;
		next(err);
	});

	// development error handler
	// will print stacktrace
	if (app.get('env') === 'development') {
		app.use(function(err, req, res, next) {
			res.status(err.status || 500).json({
				"Error": (err.status || 500)
			});
		});
	}

	// production error handler
	// no stacktraces leaked to user
	app.use(function(err, req, res, next) {
		res.status(err.status || 500).json({
			"Error": (err.status || 500)
		});
	});

	//Serve the application
	app.listen(sayonaraConfig.appPort);
	console.log("App listening on port " + sayonaraConfig.appPort);

	module.exports = app;
});
