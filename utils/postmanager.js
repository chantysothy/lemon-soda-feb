﻿var express = require('express');
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
var emitter = require('events').EventEmitter;
var inherits = require('util').inherits;

var self
var PostManager = function () { //constructor
    isFreeForFacebook = true;
    self = this;
} 


PostManager.prototype.getTwitterToken = function (callback) {
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

PostManager.prototype.postToTwitter = function (dataToPost, callback) {//dataToPost. postToString, caption, link, pictureLink, headerOptions
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

PostManager.prototype.postToGooglePlus = function (dataToPost, callback) {

}//var postToGooglePlus = function (dataToPost, callback) {

PostManager.prototype.postToLinkedIn = function (dataToPost, callback) {

}//var postToLinkedIn = function (dataToPost, callback) {

PostManager.prototype.postToYouTube = function (dataToPost, callback) {

}//var postToYouTube = function (dataToPost, callback) {

PostManager.prototype.postToInstagram = function (dataToPost, callback) {

}//var postToInstagram = function (dataToPost, callback) {

PostManager.prototype.postUsingVignette = function (dataToPost, callback) {
    //self.isFreeForFacebook = false;
    var postElement = dataToPost;
    var postableLocations
        var email = postElement.email;
        if (email) {
            var task = postElement.task;
                var vignettes = task.vignettes;
//            for (var vignetteCounter = 0; vignetteCounter < vignettes.length; vignetteCounter++) {
                var vignette = vignettes[0];
                var condition = { _id: vignette.id }
                vignetteModel.findOne(condition, function (err, doc) {
                    if (err) {
                        var message = { status: "ERROR", message: "ERROR while getting vignette info. " + JSON.stringify(err) }

                        if (callback) {
                            callback(message);
                            return;
                        }//if (callback) {
                    }
                    if (doc) {
                        var postableLocs = doc.data.locs
                        postableLocations = postableLocs;
                            for (var postableLocLen = 0; postableLocLen < postableLocs.length; postableLocLen++) {
                                var postableLoc = postableLocs[postableLocLen];
                                var smName = postableLoc.sm_name;
                                var locType = postableLoc.type;
                                var locId = postableLoc.postableLocId;
                                postableLoc['postableLoc'] = { 'locType': locType, 'locId': locId }
                                postableLocs[0] = postableLoc;
                                switch (smName) {
                                    case "facebook":
                                        postToFacebook(dataToPost, postableLoc, callback);
                                        break;
                                    case "twitter":
                                        postToTwitter(dataToPost, callback);
                                        break;
                                    case "googlePlus":
                                        postToGooglePlus(dataToPost, callback);
                                        break;
                                }//switch (smName) {
                                //}//for (var postableLocNum = 0; postableLocNum < postableLocs.length(); postableLocNum++) {
                            }//for (var postableLocLen = 0; postableLocLen < doc.length(); postableLocLen++) {
                        }//if (doc) {
                    //}//
                });//vignetteModel.findOne(condition, function (err, doc) {
//            }//for (var vignetteCounter = 0; vignetteCounter < vignettes.length; vignetteCounter++) {
            }//if (email) {
        //}//for (var postCounter = 0; postCounter < docs.length; postCounter++) {
}//var postUsingVignette = function (dataToPost, callback) {

postToFacebookNotBeingUsed = function (dataToPost, locations, callback) { //dataToPost. postToString, caption, link, pictureLink
    var message = {};
    var task = dataToPost.task;
    var params = {};
    fbGraph.extendAccessToken({
        "access_token": task.accessCreds.facebook.authResponse.accessToken
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
            var postProcessCounter = 0;
            for (var locationCounter = 0; locationCounter < locations.length; locationCounter++){

                var path = (locations[postProcessCounter]) ? "/" + locations[postProcessCounter].postableLocId : '/me';
                process.nextTick(function () {
                    if (locations[postProcessCounter].type == 'group') {
                        path += "/feed"
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
                                //                            callback(message);
                                //                            setTimeout(function () { }, 300)
                                //return;
                            }//if (res) {
                        });//function (err, facebookRes) {
                    } else {
                        var a = locationCounter
                        fbGraph.extendAccessToken({
                            "access_token": locations[postProcessCounter].otherInfo.access_token
                            , "client_id": config.facebookAuth.client_id
                            , "client_secret": config.facebookAuth.client_secret
                        }, function (extendAccessTokenError, facebookRes) {
                            if (!extendAccessTokenError) {
                                fbGraph.setAccessToken(facebookRes.access_token);
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

                            }//if (!extendAccessTokenError) {

                        });
                    }//                if (locations[locationCounter].type == 'group') {

                });//process.nextTick(function(){
            }//for (var locationCounter = 0; locationCounter < locations.length, locationCounter++){
        } else {
            callback({ status: "ERROR", message: "facebook error while obtaining access token " + extendAccessTokenError.code + ". " + extendAccessTokenError.message });
        }
    })//fbGraph.extendAccessToken({;
}//var postToFacebook = function (options, accessToken) {

var postToFacebook = function (dataToPost, postableLocation, callback) {
    
        var processTickCounter = 0;
        //for (var locCounter = 0; locCounter < postableLocations.length; locCounter++) {

            //var postableLocation = postableLocations[processTickCounter];
            var token
            process.nextTick(function () {
                var path;
                var params = {};
                var message = {};
                (postableLocation.postableLocId) ? path = "/" + postableLocation.postableLocId : path = '/me';
                path += "/feed";
                    (postableLocation.type == "page") ? token = postableLocation.otherInfo.access_token : token = dataToPost.task.accessCreds.facebook.authResponse.accessToken;

                    if (postableLocation.type == 'page') {
                        var fbAccessToken = dataToPost.task.accessCreds.facebook.authResponse.accessToken;
                        getFacebookPageToken(fbAccessToken, postableLocation.postableLocId, function (fbPageTokenRes) {
                            if (fbPageTokenRes.access_token) {
                                fbGraph.setAccessToken(fbPageTokenRes.access_token);
                                params['caption'] = dataToPost.task.caption;
                                params['message'] = dataToPost.task.text;
                                params['picture'] = dataToPost.task.imgUrl
                                params['link'] = dataToPost.task.url

                                fbGraph.post(path, params, function (fbError, fbResponse) {
                                    if (!fbError) {
                                        if (callback)
                                            callback(fbError);
                                    } else {
                                        if (callback)
                                            callback(fbResponse);
                                    }//if (!fbError) {
                                });//fbGraph.post(path, params, function (fbError, fbResponse) {
                            } else {
                                callback({status : "ERROR", message: "An error occured while renewing page token."});
                            }//if (fbPageTokenRes.access_token) {
                        });//getFacebookPageToken(fbAccessToken, postableLocation.postableLocId, function (fbPageTokenRes) {
                    } else {//(postableLocation.tye = 'group') { //groups
                        fbGraph.setAccessToken(token);
                        params['caption'] = dataToPost.task.caption;
                        params['message'] = dataToPost.task.text;
                        params['picture'] = dataToPost.task.imgUrl
                        params['link'] = dataToPost.task.url
                        fbGraph.post(path, params, function (fbError, fbResponse) {
                            if (!fbError) {
                                if (callback)
                                    callback(fbError);
                            } else {
                                if (callback)
                                    callback(fbResponse);
                            }//if (!fbError) {
                        });//fbGraph.post(path, params, function (fbError, fbResponse) {

                    } //if (postableLocation.type == 'page') {

            });//process.nextTick(function () {

        //}//for (var locCounter = 0; locCounter < postableLocations.length; locCounter++) {
}//var postToFacebook = function(dataToPost, postableLocations, callback){

var renewFacebookToken = function (token, callback) {
    fbGraph.extendAccessToken({
        "access_token": token
        , "client_id": config.facebookAuth.client_id
        , "client_secret": config.facebookAuth.client_secret
    }, function (extendAccessTokenError, facebookRes) {
        if (extendAccessTokenError) {
            callback(facebookRes);
        }//if (extendAccessTokenError) {
    });//fbGraph.extendAccessToken({
}//var renewFacebookToken = function (token, callback) {

var getFacebookPageToken = function (fbAccessToken, pageId, callback) {
    fbGraph.setAccessToken(fbAccessToken);
    fbGraph.get("/"+pageId + "?fields=access_token", function (err, fbRes) {
        if (!err) {
            callback(fbRes)
        } else {
            callback(err);
        }
    });
}//var getFacebookPageToken = function (pageId, callback) {
inherits(PostManager, emitter);
module.exports = PostManager;