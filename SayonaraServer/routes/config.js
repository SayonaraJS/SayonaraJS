//Route to edit the sayonaraConfig.js file

//Create our router
var express = require('express');
var router = express.Router();

//Modules
var jsonfile = require('jsonfile');

//Helper functions
var routeHelpers = require('./routeHelpers');

//Path to the sayonara config
var configPath = '../sayonaraConfig.js'

router.get('/', function(req, res) {
    //Validate our JWT and permissions
    var permissions = [routeHelpers.definedPermissions.admin];
    routeHelpers.validateUser(req, permissions).then(function(result) {
        // read in the JSON file
        jsonfile.readFile(configPath, function(err, jsonObject) {
            if (err) {
                res.status(500).json(err);
                return;
            }

            //Return the json
            res.status(200).json(jsonObject);
        });
    });
});

router.put('/', function(req, res) {
    //Validate our JWT and permissions
    var permissions = [routeHelpers.definedPermissions.admin];
    routeHelpers.validateUser(req, permissions).then(function(result) {
        // read in the JSON file
        jsonfile.readFile(configPath, function(err, jsonObject) {
            if (err) {
                res.status(500).json(err);
                return;
            }

            //Edit the file
            var configKeys = Object.keys(jsonObject);
            var fileChanged = false;
            for(var i = 0; i < configKeys.length; i++) {
                if(req.body[configKeys[i]] &&
                    jsonObject[configKeys[i]]) {
                        jsonObject[configKeys[i]] = req.body[configKeys[i]];
                        fileChanged = true;
                    }
                //Check if at the last index
                if(i >= configKeys.length - 1 && !fileChanged) {
                    //Nothing changed, simply return the request
                    res.status(200).json(jsonObject);
                    return;
                }
            }

          // Write the modified obj to the file
          jsonfile.writeFile(configPath, jsonObject, function(err) {
              if (err) {
                  res.status(500).json(err);
                  return;
              }
              res.status(200).json(jsonObject);
          });
        });
    });
});

module.exports = router;
