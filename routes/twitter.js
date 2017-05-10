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
                if (doc.twitter.profileInfo) {
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
    //{
}); //router.get('/auth/twitter',

router.get('/auth/twitter/callback', function (req, res) {
    //var email = req.header.nectorr-login;
    var nectorrCookies = parseCookies(req);
    var cookies = nectorrCookies.nv;
    var email = JSON.parse(cookies).e;
    if (email) {
        console.log("twitter email : " + email);
        //req.session.oauth.verifier = req.query.oauth_verifier;
        //var oauthInfo = req.session.oauth;
        // var oauthToken = req.query.oauth_token;
        //var oauthTokenVerifier = req.query.oauth_verifier;

        var condition = { 'local.email': email }
        //https://api.twitter.com/oauth/access_token
         //consumer().get("https://api.twitter.com/1.1/account/verify_credentials.json", oauthToken, oauthTokenVerifier, function (error, data, response) {

        consumer().getOAuthAccessToken(req.session.oauthRequestToken, req.session.oauthRequestTokenSecret, req.query.oauth_verifier, function (error, data, response) {
    if (error) {
        res.send({ status: "ERROR", message: "Error getting twitter screen name : " });
            } else {
                consumer().get("https://api.twitter.com/1.1/account/verify_credentials.json", data, response, function (error, userData, response) {
                    if (error) {
                        res.send({ status: "ERROR", message: "Error getting twitter screen name : " });
                    } else {
                        var twitterUserInfo = JSON.parse(userData)
                        userModel.findOne(condition, function (error, userInfo) {

                            if (error) {
                                //sendMessageToServer
                                return;
                            }

                            if (userInfo) {
                                //res.send({ smProfile: userInfo });
                                //res.res.send({ 'email': email });
                                //res.res.send({ sm_name: 'twitter' });
                                //res.redirect('/profile/save');
                                userInfo.twitter.profileInfo = twitterUserInfo;
                                userInfo.save(function (err, doc, numRec) {
                                    if (err) {
                                        res.send({ status: 'ERROR', message: "error in updating twitter login info - " + JSON.parse(err) });
                                        res.end();
                                        return;
                                    }
                                    if (numRec>0) {
                                        res.send({ status: 'SUCCESS', message: "Twitter creds successfully updated " , action : "CLOSE_WINDOW" });
                                        res.end();
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

});//router.get('auth/twitter/callback', function (req, res) {
router.post('/twitter/post/new', function (req, res) {

}); //router.post('/post / twitter', function (req, res) {

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