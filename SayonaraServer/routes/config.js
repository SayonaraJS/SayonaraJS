//Route to edit the sayonaraConfig.js file

//Create our router
var express = require('express');
var router = express.Router();

//Helper functions
var routeHelpers = require('./routeHelpers');

//Path to the sayonara config
var configPath = '../sayonaraConfig.js'

router.get('/', function(req, res) {
    //Validate our JWT and permissions
    var permissions = [routeHelpers.definedPermissions.admin];
    routeHelpers.validateUser(req, permissions).then(function(result) {
        //Read/Require the json file
        var jsonFile = require(configPath);
        res.status(200).json(jsonFile);
    });
});

//http://stackoverflow.com/questions/10685998/how-to-update-a-value-in-a-json-file-and-save-it-through-node-js
router.put('/', function(req, res) {
    //Validate our JWT and permissions
    var permissions = [routeHelpers.definedPermissions.admin];
    routeHelpers.validateUser(req, permissions).then(function(result) {
        //Read/Require the json file
        var jsonFile = require(configPath);

        //Edit the file
        var configKeys = Object.keys(jsonFile);
        var fileChanged = false;
        for(var i = 0; i < configKeys.length; i++) {
            if(req.body[configKeys[i]] &&
                jsonFile[configKeys[i]]) {
                    jsonFile[configKeys[i]] = req.body[configKeys[i]];
                    fileChanged = true;
                }
            //Check if at the last index
            if(i >= configKeys.length - 1 && !fileChanged) {
                //Nothing changed, simply return the request
                res.status(200).json(jsonFile);
                return;
            }
        }

        //Use the route helpers to edit the file
        routeHelpers.editSayonaraConfig(jsonFile).then(function(success) {
            //Returnt eh json to the client
            res.status(200).json(success);
            return;
        }, function(error) {
            res.status(error.status).send(error.message);
            return
        });
    });
});

module.exports = router;
