//Sayonara config contains secrets for JWT, database URLs, etc..
//For New Sayonara users, we highly reccomend you do NOT upload your sayonaraConfig file to git

//Initialize the config
var sayonaraConfig = {};

//Default/Required values
sayonaraConfig.appPort = '8000';
sayonaraConfig.dbUrl = 'mongodb://localhost/sayonara';
sayonaraConfig.clientRoot = '../SayonaraClients/goodbye';
sayonaraConfig.authSecret = 'listredcomputercup1%';
sayonaraConfig.authIssuer = 'Sayonara';
sayonaraConfig.siteName = 'Sayonara Default';

//Any Custom Sayonara Config Values Go Here. They will become Editable on the Admin Page!
//

module.exports = sayonaraConfig;
