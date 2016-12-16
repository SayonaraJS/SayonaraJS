//Route for getting the public json for the site

//Create our router
var express = require('express');
var router = express.Router();

//Helper functions
var routeHelpers = require('./routeHelpers');

// User models
var mongoose = require('mongoose');
var Page = mongoose.model('Page');

//Public get, returns all public visible information of a website
//Returns an array of pages to be deciphered
router.get('/', function(req, res) {

    //Our Sayonara Config (For Site name and things)
    var sayonaraConfig = require('../sayonaraConfig');

    //Find all pages, and populate, EVERYTHING
    Page.find({})
        .populate('categories')
        .populate({
            path: 'entryTypes',
            model: 'EntryType',
            populate: {
                path: 'entries',
                model: 'Entry',
                populate: {
                    path: 'categories',
                    model: 'Category'
                }
            }
        })
        .exec(function(err, pages) {
        if (err) {
            res.status(500).json(err);
            return;
        }

        //Return the public info (pages, and site name)
        var response = {};
        if(sayonaraConfig.siteName) response.siteName = sayonaraConfig.siteName;
        response.pages = pages;
        res.status(200).json(response);
    });
});

module.exports = router;
