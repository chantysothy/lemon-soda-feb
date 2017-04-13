var express = require('express');
var router = express.Router();
var passport = require('passport');
var FacebookStrategy = require('passport-facebook').Strategy;
var TwitterStrategy = require('passport-twitter').Strategy;
var GoogleStrategy = require('passport-google-oauth').Strategy;
var fbGraph = require('fbgraph');
var Twitter = require('twitter');
var google = require('googleapis');
var config = require('../config/config');
var request = require('request');
var schedule = [];
var dbConfig = require('../config/database');
var userModel = require('../models/user');
var vignetteModel = require('../models/vignettes');
var userUtils = require('../utils/userUtils');
var userPosts = require('../models/userposts');
var config = require('../config/config');

var postToFacebook = function (dataToPost, callback) { //dataToPost. postToString, caption, link, pictureLink
    var message = {};

    var params = {};
    fbGraph.extendAccessToken({
        "access_token": dataToPost.accessToken
        , "client_id": config.facebookAuth.client_id
        , "client_secret": config.facebookAuth.client_secret
    }, function (extendAccessTokenError, facebookRes) {
        if (!extendAccessTokenError) {
            fbGraph.setAccessToken(facebookRes.access_token);
            //            postToFacebook(dataToPost, callback);
            params['message'] = dataToPost.caption;
            params['name'] = dataToPost.text;
            //params['description'] = 'this is a description
            params['link'] = dataToPost.url;
            params['picture'] = dataToPost.imgUrl;
            params['caption'] = dataToPost.caption;

            var path = (dataToPost.urlToPost) ? dataToPost.urlToPost : '/me';

            fbGraph.post(path, params, function (postError, postResponse) {
                if (postError) {
                    message['status'] = "ERROR";
                    message['message'] = "An error occured while posting to facebook. Code - " + postError.code + " from facebook.";
                    callback(message);
                    setTimeout(function () { }, 300)
                    return;
                }//if (err) {
                if (!postResponse.error) {
                    message['status'] = "SUCCESS";
                    message['message'] = "Successfully posted to facebook."
                    message['data'] = { "postId": res, accessToken: facebookRes.access_token }
                    callback(message);
                    setTimeout(function () { }, 300)
                    //return;
                }//if (res) {
            });//function (err, facebookRes) {
        } else {
            callback({ status: "ERROR", message: "facebook error while obtaining access token " + extendAccessTokenError.code + ". " + extendAccessTokenError.message });
        }
    })//fbGraph.extendAccessToken({;
}//var postToFacebook = function (options, accessToken) {

var getTwitterToken = function (callback) {
    passport.use("twitter", new TwitterStrategy({

        // pull in our app id and secret from our auth.js file
        'clientID': configAuth.facebookAuth.client_id
        , 'clientSecret': configAuth.facebookAuth.client_secret

    },
        function (token, refreshToken, profile, done) {
            if (callback)
                callback({ accessToken: token, 'refreshToken': refreshToken, userProfile, profile });
        }) //function (token, refreshToken, profile, done) {
    );//passport.use("facebook", new FacebookStrategy({


}


var postToTwitter = function (dataToPost, callback) {//dataToPost. postToString, caption, link, pictureLink, headerOptions
    getBearerCode(function (twitterLoginData) {
        var twitter = new Twitter({
            consumer_key: config.twitter.consumer_key
            , consumer_secret: config.twitter.consumer_secret
            , bearer_token: twitterLoginData.access_token
        });//var twitter = new Twitter({

        var twitterPost = {
            media_ids: []
            , url: dataToPost.link
            , status: dataToPost.caption
        };

        uploadMediaToTwitter(dataToPost.imgUrl, function (media) {
            var USER_TIMELINE_URL = 'statuses/user_timeline';
            twitterPost.media_ids = [media.media_id_string]
            twitter.post(USER_TIMELINE_URL, twitterPost, function (twitterPostError, doc) {
                if (twitterPostError) {
                    message['status'] = "ERROR";
                    message['message'] = "An error occured while posting to twitter. " + JSON.stringify(twitterPostError);
                    callback(message);
                    return;
                }//if (err) {
                if (doc && !doc.error) {
                    message['status'] = "SUCCESS";
                    message['message'] = "Successfully posted to twitter."
                    callback(message);
                    return;
                }//if (res) {
            });//twitter.post(postToString, dataToPost, function (err, doc) {
        });//uploadMediaToTwitter(dataToPost.picturelink, function (data) {
    });//getTwitterToken(function (twitterLoginData) {
}//var postToTwitter = function (dataToPost, callback) {


var postToGooglePlus = function (dataToPost, callback) {

}//var postToGooglePlus = function (dataToPost, callback) {


var postToLinkedIn = function (dataToPost, callback) {

}//var postToLinkedIn = function (dataToPost, callback) {


var postToYouTube = function (dataToPost, callback) {

}//var postToYouTube = function (dataToPost, callback) {


var postToInstagram = function (dataToPost, callback) {

}//var postToInstagram = function (dataToPost, callback) {


var postUsingVignette = function (dataToPost, callback) {
    var email = dataToPost['email'];
    if (email) {
        var vignettes = dataToPost['vignettes']
        for (var vignetteCounter = 0; vignetteCounter < vignettes.length; vignetteCounter++) {
            var vignetteId = vignetttes[vignetteCounter].id;
            var condition = { _id: vignetteId }
            vignetteModel.findOne(condition, function (err, doc) {
                if (err) {
                    var message = { status: "ERROR", message: "ERROR while getting vignette info. " + JSON.stringify(err) }

                    if (callback) {
                        callback(message);
                        return;
                    }//if (callback) {
                    if (doc) {
                        for (var postableLocLen = 0; postableLocLen < doc.length(); postableLocLen++) {
                            var postableLocs = doc[postableLocLen].data.locs;
                            for (var postableLocNum = 0; postableLocNum < postableLocs.length(); postableLocNum++) {
                                var postableLoc = postableLocs[postableLocNum];
                                var smName = postableLoc.sm_name;
                                var locType = postableLoc.type;
                                var locId = postableLoc.postableLocId;
                                switch (smName) {
                                    case "facebook":
                                        postToFacebook(dataToPost, callback);
                                        break;
                                    case "twitter":
                                        postToTwitter(dataToPost, callback);
                                        break;
                                    case "googlePlus":
                                        postToGooglePlus(dataToPost, callback);
                                        break;
                                }//switch (smName) {
                            }//for (var postableLocNum = 0; postableLocNum < postableLocs.length(); postableLocNum++) {
                        }//for (var postableLocLen = 0; postableLocLen < doc.length(); postableLocLen++) {
                    }//if (doc) {
                }//
            });//vignetteModel.findOne(condition, function (err, doc) {
        }//for (var vignetteCounter = 0; vignetteCounter < vignettes.length; vignetteCounter++) {
    }//if (email) {
}//var postUsingVignette = function (dataToPost, callback) {