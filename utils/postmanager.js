var express = require('express');
var FormData = require('form-data');
var poster = require('poster');
var path = require('path');
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
var Promise = require('bluebird');
var fileSystem = require('fs');
//var fileSystem = new FS();
const fbVideos = require('facebook-api-video-upload');
const ImageUploader = require('./imageUploader');
var imageUploader = new ImageUploader();
//var request = require('request');
//import requestPromise from 'request-promise';
var async = require('asyncawait/async');
var await = require('asyncawait/await');
var self, baseUrlWithDomain;

var fs = require('fs');
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
            for (var vignetteCounter = 0; vignetteCounter < vignettes.length; vignetteCounter++) {
                var vignette = vignettes[vignetteCounter];
                if (vignette) {
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
                } else {
                    callback(null)
                }
            }//for (var vignetteCounter = 0; vignetteCounter < vignettes.length; vignetteCounter++) {
            }//if (email) {
        //}//for (var postCounter = 0; postCounter < docs.length; postCounter++) {
}//var postUsingVignette = function (dataToPost, callback) {

var postToTwitter = function (dataToPost,postableLocs, callback) {//dataToPost. postToString, caption, link, pictureLink, headerOptions
    var email = dataToPost.email;
    getLoginObject(email,function (loginObject) {
        var twitterScreenName = loginObject.twitter.profileInfo.screen_name;
        getBearerCode(function (twitterLoginData) {
            var twitter = new Twitter({
                consumer_key: config.twitter.consumer_key
                , consumer_secret: config.twitter.consumer_secret
                , bearer_token: twitterLoginData.access_token
            });//var twitter = new Twitter({

            var twitterPost = {
                media_ids: []
                , screen_name: twitterScreenName
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
                        message['data'] = media
                        callback(message);
                        return;
                    }//if (res) {
                });//twitter.post(postToString, dataToPost, function (err, doc) {
            });//uploadMediaToTwitter(dataToPost.picturelink, function (data) {
        });//getTwitterToken(function (twitterLoginData) {
    });//getLoginObject(function (loginObject) {
}//var postToTwitter = function (dataToPost, callback) {


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

                var fbPath = (locations[postProcessCounter]) ? "/" + locations[postProcessCounter].postableLocId : '/me';
                process.nextTick(function () {
                    if (locations[postProcessCounter].type == 'group') {
                        //path += "/feed"
                        fbGraph.post(fbPath, params, function (postError, postResponse) {
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

var postToFacebook = function (dataToPost, postableLocation,  callback) {
        var processTickCounter =  0;
        //for (var locCounter = 0; locCounter < postableLocations.length; locCounter++) {

            //var postableLocation = postableLocations[processTickCounter];
            var token
            process.nextTick(function () {
                var path;
                var params = {};
                var message = {};
                var videoPost = false;
                (postableLocation.postableLocId) ? path = "/" + postableLocation.postableLocId : path = '/me';
                if (dataToPost.task.videoPost) {
                    path += "/videos";///feed";
                    videoPost = true;
                } else if (dataToPost.task.imgUrl) {
                    path += "/photos";
                }
                    (postableLocation.type == "page") ? token = postableLocation.otherInfo.access_token : token = dataToPost.task.accessCreds.facebook.authResponse.accessToken;

                    if (postableLocation.type == 'page') {
                        var fbAccessToken = dataToPost.task.accessCreds.facebook.authResponse.accessToken;
                        getFacebookPageToken(fbAccessToken, postableLocation.postableLocId, function (fbPageTokenRes) {
                            if (fbPageTokenRes.access_token) {
                                fbGraph.setAccessToken(fbPageTokenRes.access_token);

                                if (!videoPost) {
                                    if (dataToPost.task.url) {
                                        params['caption'] = dataToPost.task.caption;
                                        params['message'] = dataToPost.task.text;
                                        if (dataToPost.task.imgUrl) {
                                            params['url'] =  dataToPost.task.imgUrl;
                                        }
                                        if (dataToPost.task.url) {
                                            params['link'] = dataToPost.task.url
                                        }
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
                                        writeMediaStream(path, dataToPost.task.caption, dataToPost.task.message, fbPageTokenRes.access_token, dataToPost.task.imgUrl, function (photoWriteData) {
                                            var a = photoWriteData;
                                            //save post id to db
                                        });
                                    }
                                } else {
                                    const params = {
                                        token : fbPageTokenRes.access_token, // with the permission to upload 
                                        id: postableLocation.postableLocId, //The id represent {page_id || user_id || event_id || group_id} 
                                        title: unescape(encodeURIComponent(dataToPost.task.caption)) ,//+ "\n" + encodeURIComponent(dataToPost.task.text))),
                                        stream : readVideoStream(dataToPost.task.videoPost) //path to the video                                         
                                    };
                                    //writeMediaStream(path, dataToPost.task.caption, dataToPost.task.message, fbPageTokenRes.access_token, dataToPost.task.videoPost, function (fbVideoResponse) {
                                    //    var a = fbVideoResponse;
                                    //});
                                    fbVideos(params).then((res) => {
                                        //console.log('res: ', res);
                                        
                                        if (callback)
                                            callback({ status: "SUCCESS", message: 'video uploaded.', data: {video_id : res.video_id}});
                                        //res:  { success: true, video_id: '1838312909759132' } 
                                    }).catch((e) => {
                                        console.error(e);
                                        callback({ status: "ERROR", message: 'video upload error.' + JSON.stringify(e) });
                                    });
                                }//fbVideos(args).then((res) => {
                            } else {
                                callback({status : "ERROR", message: "An error occured while renewing page token."});
                            }//if (fbPageTokenRes.access_token) {
                        });//getFacebookPageToken(fbAccessToken, postableLocation.postableLocId, function (fbPageTokenRes) {
                    } else {//(postableLocation.tye = 'group') { //groups      /me/feed
                        fbGraph.setAccessToken(token);
                        if (!dataToPost.task.videoPost) {
                            if (dataToPost.task.url) {
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
                                writeMediaStream(path, dataToPost.task.caption, dataToPost.task.message, token, dataToPost.task.imgUrl)
                                .then(function (data) {
                                    a = data;
                                    //save
                                }).catch(function (err) {

                                });

                            }//if (dataToPost.task.url) {
                        } else {
                            params['title'] = dataToPost.task.caption;
                            params['description'] = dataToPost.task.text;
                            params['source'] = "@" + dataPost.task.videoPost;
                            const args = {
                                token: fbPageTokenRes.access_token, // with the permission to upload 
                                id: postableLocation.postableLocId, //The id represent {page_id || user_id || event_id || group_id} 
                                title: unescape(encodeURIComponent(dataToPost.task.caption)),
                                stream: readVideoStream(dataToPost.task.videoPost) //path to the video 
                            };
                            //writeMediaStream(path, dataToPost.task.caption, dataToPost.task.message, token, dataToPost.task.videoPost, function (fbVideoResponse) {
                            //    var a = fbVideoResponse;
                            //});
                            fbVideos(args).then((res) => {
                                console.log('res: ', res);
                                if (callback)
                                    callback({ status: "SUCCESS", message: 'video uploaded.', data: { video_id: res.video_id } });
                                //res:  { success: true, video_id: '1838312909759132' } 
                            }).catch((e) => {
                                console.error(e);
                                callback({ status: "ERROR", message: 'video upload error.' + JSON.stringify(e) });
                            });
                        }
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
        if (!extendAccessTokenError) {
            callback(facebookRes);
        } else {
            callback(extendAccessTokenError);
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

var uploadVideoToFacebook = function (params, postableLocation, token, callback) {
    //fbGraph.api
    var formData = {
        access_token: token,
        id: postableLocation.postableLocId,
        title: unescape(encodeURIComponent(params.caption)),
        "description": unescape(encodeURIComponent(params.desc)),
        "file": "@" + params.source
    }
//    "source": "@" + params.fileName,

    var contentLength = JSON.stringify(formData).length;
    var url = 'https://graph-video.facebook.com/v2.9/' + "me" + '/videos?access_token='+token;
//    var url = 'https://graph-video.facebook.com/v2.9/' + postableLocation.postableLocId + '/videos?access_token=' + token;
    var requestObject = request({
        headers: {
            'Content-Length': contentLength,
            'Content-Type': 'application/x-www-form-urlencoded'
        }
        , uri: url
        , body: JSON.stringify(formData)
        , method: 'POST'
    }, function (error, response, body) {
        if (callback && (response.statusCode == 200)) {
            callback({
                "error" : error
                , "response" : response
                , "body" : body
            });//callback({
        }//if (callback) {
    });//var requestObject = request({}, function (response) {


}//var uploadVideoToFacebook = function (buffer, caption, desc, postableLocation, token) { 

//(async (function uploadVideoToFacebook(buffer, caption,desc,postableLocation,token) {
//    let url = 'https://graph-video.facebook.com/v2.9/' + postableLocation.postableLocId + '/videos?access_token=' + token

//    let formData = {
//        title: caption,
//        "description" :desc,
//        source: {
//            value: buf,
//            options: {
//                filename: 'video_' + Date.now() + '.mp4',
//                contentType: 'video/mp4'
//            }
//        }
//    }
//    //const req = new requestPromise();
//    return await (request({ method: 'POST', url, formData }, function (incoming) {
//        var a = incoming
//    }))();

//    }))()//async function uploadVideoToFacebook(buffer) {

var readVideoStream = function (pathWithFile) {
    //var returnValue;
    //var temp = path.split('/');
    //if (temp.length > 0) {
    //    var videoName = temp[temp.length - 1];
    //    videoName = "../lemon-soda-jan/public/upload/videos/" + videoName;
        var returnValue = fileSystem.createReadStream(pathWithFile);
    //}//if (temp.length > 0) {
    return returnValue
}//var readVideo = function (path) {

var readFileStream = function (fileName, callback) {
    var returnValue;
    if (fileName) {
        fileSystem.readFile(fileName, "base64", callback)
    }//if (path) {
}//var readVideo = function (path) {

var writeMediaStream = async (function (fbPath, caption,message, accessToken, fileWithPath, callback) {
    if (callback) {
        var url = "https://graph.facebook.com" + fbPath + "?access_token=" + accessToken;
//        readFileStream(fileWithPath, function ( fileContent) {
        var options = {
            uploadUrl: url,//'https://graph.facebook.com/' + user + '/photos?access_token=' + accessToken,
            method: 'POST',
            fileId: 'source',
            fields: { 'message': (message)?message:"" , // Additional fields according to graph API
                     'caption': (caption) ? caption : "" } // Additional fields according to graph API
        };

        await (poster.post(fileWithPath, options, function (err, data) {
            if (err) {
                callback({ status: "ERROR", message: JSON.stringify(err) });
                //Something went wrong
            } else {
                // Everything ok
             }
        }));//poster.post(fileName, options, function (err, data) {
    }//if (callback) {
})//var writePhotoStream = function (accessToken, fileWithPath) {

var getLocsAccessCode = function (dataToPost, locs, callback) {
    var totalAccessCode = 0;
    for (var locsCounter = 0; locsCounter < locs.length; locsCounter++) {

    }//for (var locsCounter = 0; locsCounter < locs.length; locsCounter++) {
}//var getLocsAccessCode = function (dataToPost, locs, callback) {
var batchPostToFbLocs = function (dataToPost, locs, callback) {
    var isLocs = false;
    var batchPostable = []; token;actualLocCounter = 0;
    //(postableLocation.type == "page") ? token = postableLocation.otherInfo.access_token : token = dataToPost.task.accessCreds.facebook.authResponse.accessToken;
    for (var locCounter = 0; locCounter < locs.length; locCounter++) {
        var postableLoc = locs[actualLocCounter];

        if (postableLoc.type =='page'){

            var locId = postableLoc.postableLocId;
            getFacebookPageToken(dataToPost.task.accessCreds.facebook.authResponse.accessToken, locId, function (res) {
                locs[actualLocCounter]['token'] = res.access_token;
                actualLocCounter++
            });//getFacebookPageToken(dataToPost.task.accessCreds.facebook.authResponse.accessToken, locId, function (res) {

        } else {
            locs[actualLocCounter]['token'] = dataToPost.task.accessCreds.facebook.authResponse.accessToken;
        }
    }//for (var locCounter = 0; locCounter < locs.length; locCounter++) {
    if (actualLocCounter == locs.length) {

    }//if (actualLocCounter == locs.length) {
}//var batchPostToFbLocs = function (dataToPost, locs, callback) {

var getLoginObject = function (email, callback) {
    if (email) {
        var condition = { 'local.email': email };
        userModel.findOne(condition, function (err, doc) {
            if (doc) {
                if (callback) {
                    callback(doc._doc);
                }
            } else {
                if (callback) {
                    callback({ status: "ERROR", message: JSON.stringify(err) });
                }

            }
        });//userModel.findOne(condition, function (err, doc) {
    }//if (email) {
}//var getLoginObject = function (email, callback) {

function getBearerCode(callback) {
    var returnValue
    var enc_secret = new Buffer(config.twitter.keys.consumer_key + ':' + config.twitter.keys.consumer_secret).toString('base64');
    var oauthOptions = {
        url: //config.twitter.urls.access_token_url,
        'https://api.twitter.com/oauth2/token', //https://api.twitter.com/oauth/access_token
        //url: 'https://api.twitter.com/oauth/access_token',
        headers: { 'Authorization': 'Basic ' + enc_secret, 'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8' },
        body: 'grant_type=client_credentials'
    };
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


inherits(PostManager, emitter);
module.exports = PostManager;