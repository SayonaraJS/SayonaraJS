//Sayonara config contains secrets for JWT, database URLs, etc..
//For New Sayonara users, we highly recommend you do NOT upload your sayonaraConfig file to git
//Any Custom Sayonara Config Values Go Here. They will become Editable on the Admin, Sayonara config Page!
//Setting "runInitialSetup" to true, will allow you to clear your website, and re-run the setup.
//Don't remove the default json atrributes on this config file, as it can break your server.
//Default Json atrributes:
//appPort: "8000", dbUrl: "mongodb://localhost/sayonara", clientRoot: "../SayonaraClients/helooo", authSecret: "listredcomputercup1%", authIssuer: "Sayonara", siteName: "Sayonara Default", runInitialSetup: false, initialSetupDate: "Date goes here"
module.exports = {
    "appPort": "8000",
    "dbUrl": "mongodb://localhost/sayonara",
    "clientRoot": "../SayonaraClients/goodbye",
    "authSecret": "supersecretsayonaragoodbye1%",
    "authIssuer": "Sayonara",
    "siteName": "New Sayonara Site",
    "runInitialSetup": true,
    "initialSetupDate": false
}
