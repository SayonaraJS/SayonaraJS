//Sayonara configuration
var sayonaraConfig = require('../sayonaraConfig');

//Passport Strategies
var LocalStrategy = require('passport-local').Strategy;
var JwtStrategy = require('passport-jwt').Strategy;
var ExtractJwt = require('passport-jwt').ExtractJwt;

//Password Hashing
var passAuth = require('passport-local-authenticate');

// User models
var mongoose = require('mongoose');
var User = mongoose.model('User');
var Permissions = mongoose.model('Permissions');

module.exports = function() {

// Serialization and Deserialization, required by passport.
passport.serializeUser(function(user, done) {
	done(null, user.id);
});
passport.deserializeUser(function(id, done) {
	User.findById(id, function(err, user) {
		done(err, user);
	});
});

//LocalStrategy (Used for Logging in/Creating users)
passport.use(new LocalStrategy({
			usernameField: 'email',
			passwordField: 'password',
			passReqToCallback: true,
			session: false
		},
		function(req, username, password, done) {
			console.log('hi');

			//If route is invalid
			return done(null, false, {
				message: 'Invalid Route'
			});

		})
}));

//JWT Strategy (Used for Authenticating endpoints)
var jwtOptions = {
	secretOrKey: sayonaraConfig.authSecret,
	issuer: sayonaraConfig.authIssuer,
	audience: sayonaraConfig.siteName
};

jwtOptions.jwtFromRequest = ExtractJwt.fromAuthHeader();

passport.use(new JwtStrategy(jwtOptions, function(jwt_payload, done) {
	User.findOne({
		id: jwt_payload.sub
	}, function(err, user) {
		if (err) {
			return done(err, false);
		}
		if (user) {
			done(null, user);
		} else {
			done(null, false);
		}
	});
}));
}
