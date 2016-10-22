var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

//Path for grabbing local paths
var path = require('path');

var routes = require('./routes/index');

var app = express();

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
	extended: false
}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'uploads')));

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

//Define our api routes
app.use('/api', routes);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
	var err = new Error('Not Found');
	err.status = 404;
	next(err);
});

// error handlers

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
app.listen(8000);
console.log("App listening on port 8000");

module.exports = app;
