var express = require('express');
var router = express.Router();
var request = require('request');
var Twit = require('twit');
var nTwitter = require('ntwitter');
var config = require('../config/config');
var passport = require('passport');
var twitterStrategy = require('passport-twitter').Strategy; 
var userModel = require('../models/user');
// instantiate Twit module
var twitter = new Twit(config.twitter);
var nt = new nTwitter({
    consumer_key: config.twitter.consumer_key
    , consumer_secret: config.twitter.consumer_secret
    , access_token_key: config.twitter.access_token
    , access_token_secret: config.twitter.access_token_secret
});

//var config = twitter.getAuth();
//twitter.setAuth(config);
var appVersion = '1.10';
var TWEET_COUNT = 15;
var MAX_WIDTH = 305;
var OEMBED_URL = 'statuses/oembed';
var USER_TIMELINE_URL = 'statuses/user_timeline';

/**
 * GET tweets json.
 */
var consumer_key = config.twitter.consumer_key;
var consumer_secret = config.twitter.consumer_secret;
//var enc_secret = new Buffer(consumer_key + ':' + consumer_secret).toString('base64');
var enc_secret = new Buffer(consumer_key + ':' + consumer_secret).toString('base64');
var twit = new Twit(config.twitter);
var oauthOptions = {
    url: 'https://api.twitter.com/oauth2/token', //https://api.twitter.com/oauth/access_token
    //url: 'https://api.twitter.com/oauth/access_token',
    headers: { 'Authorization': 'Basic ' + enc_secret, 'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8' },
    body: 'grant_type=client_credentials'
};

var BearerCode = getBearerCode();

router.get('/user_timeline/:user', function(req, res) {

    var bearer;//= JSON.parse(BearerCode).access_token;
    var userName , userId;
    var oEmbedTweets = [], tweets = [],
  
        params = {
            screen_name: req.params.user, // the user id passed in as part of the route
            count: TWEET_COUNT // how many tweets to return
        };
//var ntwitter = require('ntwitter');
    nt.verifyCredentials(function (error, data) {
        if (!error) {
            userName = data.name;
            userId = data.id;
        }
    });
    nt.getFollowersIds(userId, function (error, data) { 
        tweets = tweets.push(data);
    });
    
  // the max_id is passed in via a query string param
  if(req.query.max_id) {
    params.max_id = req.query.max_id;
  }
    //twitter.setAuth(config.twitter);
    var c = config.twitter;
    //c.bearer_token = JSON.stringify(BearerCode.access_token);
    //console.log('Bearer toek_type' + BearerCode.token_type);
    //console.log('Bearer token value' + c.bearer_token);
    T = new Twit(c);

    T.get(USER_TIMELINE_URL, params, function (err, data, resp) {

            tweets = data;
            
            var i = 0, len = tweets.length;
            
            for (i; i < len; i++) {
                getOEmbed(tweets[i]);
            }

        });
    // request data 
  //twitter.get(USER_TIMELINE_URL, params, function (err, data, resp) {

  //  tweets = data;
    
  //  var i = 0, len = tweets.length;

  //  for(i; i < len; i++) {
  //    getOEmbed(tweets[i]);
  //      }

  //});

  /**
   * requests the oEmbed html
   */
  function getOEmbed (tweet) {

    // oEmbed request params
    var params = {
      "id": tweet.id_str,
      "maxwidth": MAX_WIDTH,
      "hide_thread": true,
      "omit_script": true
    };

    // request data 
    twitter.get(OEMBED_URL, params, function (err, data, resp) {
      tweet.oEmbed = data;
      oEmbedTweets.push(tweet);

      // do we have oEmbed HTML for all Tweets?
      if (oEmbedTweets.length == tweets.length) {
        res.setHeader('Content-Type', 'application/json');
        res.send(oEmbedTweets);

      }
    });
  }
});

router.get('/auth/twitter/', function (req, res) {
    var callback = req.query.callback;
    if (callback) {
        var userEmail= req.query.email;
        if (!userEmail) {
            messageForServer = { status: 'ERROR', message: "Invalid User Credentials recieved by localhost:1337 server." };
            sendMessageToServer(messageForServer, callback, res);
            return;
        } //        if (!userEmail) {
        var twitterAccessToken, twitterAccessTokenSecret;
        //nTwitter.
        nt.verifyCredentials(function (err, data) {
            //console.log(data);
            userModel.findOne({ 'local.email': userEmail }, function (err, dbData) {
                if (err) {
                    messageForServer = { status: 'ERROR', message: "User Credentials verification error. " + err.message };
                    sendMessageToServer(messageForServer, callback, res);
                    return;
                } else {
                    dbData._doc.twitter.profileInfo = data;
                    dbData.save(function (err) {
                        if (!err) {
                            messageForServer = { status: 'SUCCESS', message: "Twitter credentials verified by nectorr. " };
                            sendMessageToServer(messageForServer, callback, res);

                        } else {
                            messageForServer = { status: 'ERROR', message: "User Credentials verification error. " + err.message };
                            sendMessageToServer(messageForServer, callback, res);
                            return;

                        }

                    });

                } //if (err) {
            }); //userModel.findOne({ 'local.email': email }, function (err, data) {
        })            
} //    if (callback) {
});
router.get('/auth/twitter/callback', function (req, res) {
    console.log(req);
});

var sendMessageToServer = function (msg, callback, res) {
    // msg has to be a valid json object
    var payload = JSON.stringify(msg);
    payload = payload.replace(/\\n/g, "\\n")
        .replace(/\\'/g, "\\'")
        .replace(/\\"/g, '\\"')
        .replace(/\\&/g, "\\&")
        .replace(/\\r/g, "\\r")
        .replace(/\\t/g, "\\t")
        .replace(/\\b/g, "\\b")
        .replace(/\\f/g, "\\f");
    // remove non-printable and other non-valid JSON chars
    payload = payload.replace(/[\u0000-\u0019]+/g, "");
    var returnValue = callback + '(' + JSON.stringify(msg) + ')';
    //res.header('content-type', 'application / json' );
    //res.header('content-length', payload.length);
    res.send(returnValue);
    res.end();
}

function getBearerCode(callback) {
    var returnValue
    request.post(oauthOptions, function (e, r, body) {

        var bearerBody = JSON.parse(body);
        process.env.TWITTER_BEARER_TOKEN = bearerBody.access_token;
        if (callback) {
            callback(bearerBody);
        } else {
            console.log("ERROR :" + e);
            console.log("R :" + r)

            console.log("BODY :" + body)
        }//        if (callback) {
        returnValue = body;
    });
    return returnValue;
};

module.exports = router;
