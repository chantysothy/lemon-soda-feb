var express = require('express');
var nodeMailer = require('nodemailer');
var streamer = express.Router();
var config = require('../config/config');
var http = require('http');
var request = require("request");
var FacebookStrategy = require('passport-facebook').Strategy;
var passport = require('passport');
var app = express();
var fbCallback;
var fbGraph = require('fbgraph');
var userModel = require('../models/user');
var invitationModel = require('../models/invitation');
var Configuration = require('../models/track-n-listen');
var transporter = nodeMailer.createTransport('smtps://connect@localhost:1337:email123@smtp.zoho.com');
var fbOptions = config.facebookAuth;
var Passport = require('../config/passport')(passport, app);
streamer.get('/stream/twitter', function (req, res) {
        var twitter = require('ntwitter');
    var twit = new twitter({
        consumer_key: twitterDefaults.consumer_key,
        consumer_secret: twitterDefaults.consumer_secret,
        access_token_key: twitterDefaults.access_token_key,
        access_token_secret: twitterDefaults.access_token_secret
    });

});//streamer.get('/stream/twitter', function (req, res) {
streamer.get('/stream/fb', function (req, res) { 
    var callback = req.query.callback;
    
    if (callback) {
        var email = req.query.email;
        if (email) {

            getFacebookCreds(email, function (data) {
                if (data) {
                    var condition = { user_id: req.query.email }
                    Configuration.findOne(condition, function (err, foundConfig) {
                        if (foundConfig) {
                            var userListenTo = getListenTo(foundConfig)
                            if (userListenTo) {
                                var requestUrl = 'https://graph.facebook.com/oauth/authorize?client_id=' + fbOptions.client_id + '& redirect_uri=' + fbOptions.redirect_uri + '&scope=read_stream';
                                getFacebookAccessCode(function (access_code) {
                                    fbGraph.setAccessCode(access_code);
                                    for (counter = 0; counter < userListenTo.length; counter++) {
                                        setTimeout(function () {
                                            console.log('Listening to : ' + userListenTo[counter]);
                                            var searchOptions = {
                                                q: userListenTo[counter]
                                                , type: "post"
                                            };

                                            fbGraph.search(searchOptions, function (err, res) {
                                                console.log(res); // {data: [{id: xxx, from: ...}, {id: xxx, from: ...}]} 
                                                var message = { status: 'SUCCESS', 'message' : "got facebook feed", 'data': res };
                                                var returnValue = callback + '(' + JSON.stringify(message) + ')';
                                                res.send(returnValue);
                                                res.end;
                                            });
                                        }, 100);
                                    }//for (counter = 0; counter < userListenTo.length; counter++) {
                                });//getFacebookAccessCode(function (access_code) {
                                var authUrl = fbGraph.getOauthUrl({
                                    "client_id": fbOptions.client_id
                                    , "redirect_uri": fbOptions.redirect_uri
                                    , "scope": 'read_stream'
                                });
                                //request.post(authUrl, function (e, r, b) {
                                //    var temp = r;
                                //});
                                
                                //var fbgraph = new fbGraph(
                                //request(requestUrl, function (error, response, body) {
                                    
                                //    console.log(body);
                                //});
                                //fbGraph.authorize({
                                //    "client_id": fbOptions.client_id
                                //    , "redirect_uri": fbOptions.redirect_uri
                                //    , "client_secret": fbOptions.client_secret
                                //    , "code": fbOptions.code
                                //}, function (err, facebookRes) {
                                //    //res.redirect('/UserHasLoggedIn');
                                //    var temp = facebookRes;
                                //});
                                //for (counter = 0; counter < userListenTo.length; counter++) {
                                //    setTimeout(function () {
                                //        console.log('Listening to : ' + userListenTo[counter]);
                                //        var searchOptions = {
                                //            q: userListenTo[counter]
                                //            , type: "post"
                                //        };

                                //        fbGraph.search(searchOptions, function (err, res) {
                                //            console.log(res); // {data: [{id: xxx, from: ...}, {id: xxx, from: ...}]} 
                                //            var message = { status: 'SUCCESS', 'message' : "got facebook feed", 'data': res };
                                //            var returnValue = callback + '(' + JSON.stringify(message) + ')';
                                //            res.send(returnValue);
                                //            res.end;
                                //        });
                                //    }, 100);
                                //}//for (counter = 0; counter < userListenTo.length; counter++) {
                            }//if (userListenTo) {
                        }//if (foundConfig){
                    });
                } else {

                }//if (data) {
            }); //getFacebookCreds(email, function (data) {
        }// if email
    }//if (callback) {
});//router.get('/stream/facebook', function (req, res) {

var getFacebookCreds = function (email, callback) {
      if (callback) {
        userModel.findOne({ 'local.email': email }, function (err, doc) {
            if (!err) {
                callback(doc.facebook);
            }//if (!err) {
        }); //userModel.findOne({}, function (err, doc) { 
    }//if (callback) {
} //var getFacebookCreds = function (email, callback) {

var getListenTo = function (config) {
    var returnValue;
    var configString = config._doc.StreamObject.ListenTo;
    if (configString) {
        returnValue = configString.split(',');
    }
    return returnValue;
}//var getListenTo = function (config) {
var getFacebookAccessCode = function (callback) {
    if (callback) {
        passport.authenticate('facebook', function (data) {
            callback(data);
        });//        passport.authenticate('facebook', function (data) {

    }//if (callback) {
} //var getFacebookAccessCode = function (callback) {
module.exports = streamer;
