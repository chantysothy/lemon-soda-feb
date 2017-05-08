var express = require('express');
var http = require('http');
var request = require('request');
var url = require('url');
var oAuth = require('oauth');
var config = require('../config/config');
var userModel = require('../models/user');

var router = express.Router();


router.get('/auth/twitter', function (req, res) {
    var callback = req.query.callback
    if (callback) {
        var email = req.query.email;
        var condition = { 'local.email': email }
        userModel.findOne(condition, function (err, doc) {
            if (err) {
                var message = { status: "ERROR", message: "Error locating credentials on nectorr." }
                res.send(callback + "(" + JSON.stringify(message) + ")");
            } else {
                if (doc.twitter) {
                    var returnValue = { status: "SUCCESS", message: "Twitter login located", data: doc.twitter };
                    res.send(callback + "(" + JSON.stringify(returnValue) + ")");
                    res.end();
                } else {
                    var consumer = new oAuth.OAuth(
                        config.twitter.urls.request_token_url, config.twitter.urls.access_token_url,
                        config.twitter.keys.consumer_key, config.twitter.keys.consumer_secret, "1.0A", config.twitter.urls.redirect_url, "HMAC-SHA1");
                    consumer.getOAuthRequestToken(function (error, oauthToken, oauthTokenSecret, results) {
                        if (error) {
                            res.send(callback + "(" + "{error: 'Error getting OAuth request token : " + util.inspect(error), 500 + "'})");
                        } else {
                            req.session.oauthRequestToken = oauthToken;
                            req.session.oauthRequestTokenSecret = oauthTokenSecret;
                            res.header('nectorr-login', email);
                            //res.redirect("https://twitter.com/oauth/authorize?oauth_token=" + oauthToken);
                            var returnValue = { status: "SUCCESS", url: "https://twitter.com/oauth/authorize?oauth_token=" + oauthToken, secret: oauthTokenSecret, action: "init_login" };
                            res.send(callback + "(" + JSON.stringify(returnValue) + ")");
                            res.end();
                        }
                    });//consumer.getOAuthRequestToken(function (error, oauthToken, oauthTokenSecret, results) {
                }
            }
        });
    }//if (email)
    //var auth = oAuth
    //var callback = req.query.callback;
    //if (callback) {
    //    twitterEmail = req.query.email;
    //    if (twitterEmail) {
    //        var twitterAPI = new Twitter({
    //            consumerKey: config.twitter.consumer_key
    //            , consumerSecret: config.twitter.consumer_secret
    //            , callback: config.twitter.redirect_url
    //        });//var twitterAPI = new Twitter(
    //        twitterAPI.getRequestToken(function (error, requestToken, requestTokenSecret, results) {
    //            if (error) {
    //                var message = { status: 'ERROR', message: 'Unable to reach twitter at the moment. Please try after some time.' }
    //                sendMessageToServer(message, callback, res);
    //            } else {
    //                twitterToken1 = requestToken;
    //                twitterToken2 = requestTokenSecret;
    //                twitterEmail = req.query.email;
    //                var twitterAuthURL = twitterAPI.getAuthUrl(requestToken);
    //                var message = { status: "SUCCESS", message: "Get a child window with params in data.", data: twitterAuthURL }
    //                sendMessageToServer(message, callback, res);
    //            }
    //        });//twitterAPIgetRequestToken(function (error, requestToken, requestTokenSecret, results) {
    //    }//if (twitterEmail
    //}//if (callback){
}); //router.get('/auth/twitter',

router.get('/auth/twitter/callback', function (req, res) {
    //var email = req.header.nectorr-login;
    var cookies = JSON.parse(parseCookies(req).nv);
    var email = cookies.e;
    if (email) {
        //req.session.oauth.verifier = req.query.oauth_verifier;
        //var oauthInfo = req.session.oauth;
        // var oauthToken = req.query.oauth_token;
        //var oauthTokenVerifier = req.query.oauth_verifier;

        var condition = { 'local.email': email }
        //https://api.twitter.com/oauth/access_token
        //consumer().get("https://api.twitter.com/1.1/account/verify_credentials.json", oauthToken, oauthTokenVerifier, function (error, data, response) {

        consumer().getOAuthAccessToken(req.session.oauthRequestToken, req.session.oauthRequestTokenSecret, req.query.oauth_verifier, function (error, data, response) {
    if (error) {
                res.send("Error getting twitter screen name : " + sys.inspect(error), 500);
            } else {
                consumer().get("https://api.twitter.com/1.1/account/verify_credentials.json", data, response, function (error, userData, response) {
                    if (error) {
                        res.send("Error getting twitter screen name : " + sys.inspect(error), 500);
                    } else {
                        var twitterUserInfo = JSON.parse(userData)
                        userModel.findOne(condition, function (error, userInfo) {

                            if (error) {
                                //sendMessageToServer
                                return;
                            }

                            if (userInfo) {
                                userInfo.twitter = twitterUserInfo;
                                userModel.update({ 'local.email': email }, userInfo, function (err, raw) {
                                    if (error) {
                                        res.send({status : "ERROR",message:"Unable to update user information to nectorr."})
                                    } else {
                                        res.send({ status: "SUCCESS", message: "Close twitter window.", action:"CLOSE_WINDOW" })
                                    }
                                });
                            }//if (userInfo) {
                        });//userModel.findOne(condition, function (error, userInfo) {
                    }

                });
                //req.session.twitterScreenName = data["screen_name"];
            } //if (error)

        });
    }//if (email) {

    //var callback = req.query.callback;
    //var twitterStream = [];
    //var twitterAPI = new Twitter({
    //    consumerKey: config.twitter.consumer_key
    //    , consumerSecret: config.twitter.consumer_secret
    //    , callback: config.twitter.redirect_url
    //});//var twitterAPI = new Twitter(
    //twitterAPI.getAccessToken(twitterToken1, twitterToken2, req.query.oauth_verifier, function (error, accessToken, accessTokenSecret, results) {
    //    if (error) {
    //        var message = { status: 'ERROR', message: 'Twitter login error : ' + JSON.stringify(error) };
    //        sendMessageToServer(message, callback, res);
    //        //console.log(error);
    //    } else {
    //        //store accessToken and accessTokenSecret somewhere (associated to the user) 
    //        var params = { include_entities: false, skip_status: false, include_email: true }
    //        twitterAPI.verifyCredentials(accessToken, accessTokenSecret, params, function (error, data, response) {
    //            if (error) {
    //                //something was wrong with either accessToken or accessTokenSecret 
    //                var message = { status: 'ERROR', message: 'Twitter verify login error : ' + JSON.stringify(error) };
    //                sendMessageToServer(message, callback, res);
    //                //start over with Step 1 
    //            } else {
    //                //accessToken and accessTokenSecret can now be used to make api-calls (not yet implemented) 
    //                //data contains the user-data described in the official Twitter-API-docs 
    //                //you could e.g. display his screen_name 
    //                var condition = { 'local.email': twitterEmail };
    //                userModel.findOne(condition, function (err, foundUser) {
    //                    if (err) {
    //                        var msg = { status: 'ERROR', message: 'There was an error in locating your twitter information. Please try later.' }
    //                        sendMessageToServer(msg, callback, res);

    //                    } else {
    //                        foundUser.twitter = data;
    //                        foundUser.save(function (err, user, numRows) {
    //                            if (err) {
    //                                var message = { status: 'ERROR', message: 'Twitter login save error : ' + JSON.stringify(error) };
    //                                sendMessageToServer(message, callback, res);
    //                            } else {
    //                                console.log(data["screen_name"]);
    //                                var message = { status: 'SUCCESS', message: 'All good at twitter. Proceed to setup. ' };
    //                                sendMessageToServer(message, callback, res);
    //                                return;
    //                            }//if (!err) {
    //                        }); // foundUser.save
    //                        var email = req.query.email;
    //                        //getTwitterStream(twitterAPI,email, function (data) {
    //                        //    if (!data.status) {
    //                        //        twitterStream.push(data);
    //                        //    } else {
    //                        //        var status = data.status;
    //                        //        var length = status.length;
    //                        //        if (status.substr(length - 4, length - 1) == 'ALL') {
    //                        //            var OEMBED_URL = 'statuses/oembed';
    //                        //            for (counter = 0; counter < data.length; counter++) {
    //                        //                var params = {
    //                        //                    "id": twitterStream[counter].id_str,
    //                        //                    "maxwidth": 350,
    //                        //                    "hide_thread": true,
    //                        //                    "omit_script": true
    //                        //                };
    //                        //                // request data 
    //                        //                twitterAPI.get(OEMBED_URL, params, function (err, data, resp) {
    //                        //                    var dataToSend = callback + '(' + data + ')';
    //                        //                    res.send(dataToSend);
    //                        //                    setTimeout(null, 200);

    //                        //                });

    //                        //            }//for (counter = 0; counter < data.length; counter++) {
    //                        //            res.end();
    //                        //        } else if (data.status == 'ERROR') {
    //                        //            var dataToSend = callback + '(' + JSON.stringify(data) + ')';
    //                        //            res.send(dataToSend);
    //                        //            res.end();
    //                        //        }//if (status.substr(length - 4, length - 1) == 'ALL') {
    //                        //    }// if (!data.status
    //                        //}); //getTwitterStream(email, function (data) {
    //                        //} //if (callback) {

    //                    }//if (err) {
    //                });
    //                res.send("/")
    //                res.end()
    //            }
    //        });
    //    }
    //});

});//router.get('auth/twitter/callback', function (req, res) {

var parseCookies = function(request) {
    var list = {},
        rc = request.headers.cookie;

    rc && rc.split(';').forEach(function (cookie) {
        var parts = cookie.split('=');
        list[parts.shift().trim()] = decodeURI(parts.join('='));
    });

    return list;
}
var consumer = function() {
    var returnValue =  new oAuth.OAuth(
        "https://twitter.com/oauth/request_token", "https://twitter.com/oauth/access_token",
        config.twitter.keys.consumer_key, config.twitter.keys.consumer_secret, "1.0A", "http://badgestar.com/sessions/callback", "HMAC-SHA1");
    return returnValue;
}
module.exports = router;