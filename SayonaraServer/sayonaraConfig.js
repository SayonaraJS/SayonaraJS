//Sayonara config contains secrets for JWT, database URLs, etc..
//Sayonara requires this file to work correctly
//For New Sayonara users, we highly reccomend you do NOT upload your sayonaraConfig file to git
//Any Custom Sayonara Config Values Go Here. They will become Editable on the Admin, Sayonara config Page!
//Don't remove the default json atrributes on this config file, as it can break your server.
//Default Json atrributes:
//appPort: "8000", dbUrl: "mongodb://localhost/sayonara", clientRoot: "../SayonaraClients/helooo", authSecret: "listredcomputercup1%", authIssuer: "Sayonara", siteName: "Sayonara Default"


module.exports = {
    "appPort": "8000",
    "dbUrl": "mongodb://localhost/sayonara",
    "clientRoot": "../SayonaraClients/goodbye",
    "authSecret": "listredcomputercup1%",
    "authIssuer": "Sayonara",
    "siteName": "Sayonara Default"
}
