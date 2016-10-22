//Sayonara config contains secrets for JWT, database URLs, etc..
//For New Sayonara users, we highly reccomend you do NOT upload your sayonaraConfig file to git

var sayonaraConfig = {
	appPort: '8000',
	dbUrl: 'mongodb://localhost/sayonara',
	authSecret: 'listredcomputercup1%',
	authIssuer: 'Sayonara',
	siteName: 'Sayonara Default'
};

module.exports = sayonaraConfig;
