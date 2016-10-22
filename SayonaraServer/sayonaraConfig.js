//Sayonara config contains secrets for JWT, database URLs, etc..
//For New Sayonara users, we highly reccomend you do NOT upload your sayonaraConfig file to git

var sayonaraConfig = {
	dbURL: 'mongodb://localhost/sayonara-default',
	authSecret: 'listredcomputercup1%'
};

module.exports = sayonaraConfig;
