﻿var express = require('express');
var router = express.Router();
var passport = require('passport');
var FacebookStrategy = require('passport-facebook').Strategy;
var TwitterStrategy = require('passport-twitter').Strategy;
var GoogleStrategy = require('passport-google-oauth').Strategy;
var fbGraph = require('fbgraph');
var Twitter = require('twitter');
var config = require('../config/config');
var request = require('request');
var schedule = [];
// passport
// agenda
//vignettes
var userModel = require('../models/user');
var userUtils = require('../utils/userUtils');
var userPosts = require('../models/userposts');
var config = require('../config/config');

router.get('/send/post/now', function (req, res) {
    var callback = req.query.callback;
    //var dataToPost={ url: shortUrlForServer, imgUrl: imageUrlForServer, caption= headingForServer, text: textForServer, sm_names :['facebook','twitter'] }
    if (callback) {
        var email = req.query.email;
        var dataToPost = JSON.parse(req.query.dataToPost);
        for (var smCounter = 0; smCounter < dataToPost.sm_names.length; smCounter++) {
            var sm_name = dataToPost.sm_names[smCounter];
            //var dataToPost;////dataToPost. postToString, caption, link, pictureLink
            switch (sm_name) {
                case 'facebook':
                    postToFacebook(dataToPost, function (serverResponse) {
                        sendMessageToServer(serverResponse, callback, res);
                    });//postToFacebook(dataToPost, function (serverResponse) {
                    break;
                case 'twitter':
                    postToTwitter(dataToPost, function (message) {
                        sendMessageToServer(message, callback, res);
                    });
                    break;
                case 'google':
                    break;
            }//switch (sm_name) {
        }//for (var smCounter = 0; smCounter < dataToPost.sm_names.length; smCounter++){
    }//if (callback) {

});//router.get('/google/profile', function (req, res) {

router.post('/send/post/vignette', function (req, res) {
    // get vignette info
    //set agenda
        // get access token
        // update database
        // post model
    // 
});//router.get('/google/profile', function (req, res) {

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

        uploadMediaToTwitter(dataToPost.picturelink, function (media) {
            twitterPost.media_ids = [media.media_id_string]
            twitter.post(dataToPost.postToString, twitterPost, function (err, doc) {
                if (err) {
                    message['status'] = "ERROR";
                    message['message'] = "An error occured while posting to twitter."
                    callback(message);
                    return;
                }//if (err) {
                if (doc) {
                    message['status'] = "SUCCESS";
                    message['message'] = "Successfully posted to twitter."
                    callback(message);
                    return;
                }//if (res) {
            });//twitter.post(postToString, dataToPost, function (err, doc) {
        });//uploadMediaToTwitter(dataToPost.picturelink, function (data) {
    });//getTwitterToken(function (twitterLoginData) {
}//var postToTwitter = function (dataToPost, callback) {

var uploadMediaToTwitter = function (pathUri, callback) {
    if (callback) {
        request.get(pathUri, function (error, response, body) {
            if (!error && response.statusCode == 200) {
                client.post('media/upload', { media: body }, function (error, media, response) {
                    callback(response);
                });//client.post('media/upload', { media: data }, function (error, media, response) {
                // Continue with your processing here.
            }
        });
        // Make post request on media endpoint. Pass file data as media parameter
    }//if (callback) {
} //var uploadMediaToTwitter = function (pathUri) {

var postToFacebook = function (dataToPost, callback) { //dataToPost. postToString, caption, link, pictureLink
    var message = {};
    //var post = { caption: dataToPost.caption, link: dataToPost.link, picture: dataToPost.pictureLink, message: dataToPost.caption };
    var params = {};
    params['message'] = dataToPost.caption;
    params['name'] = dataToPost.text;
    //params['description'] = 'this is a description';
    params['link'] = dataToPost.url;
    params['picture'] = '@'+dataToPost.imgUrl;
    params['caption'] = dataToPost.caption;
    params['me_id'] = dataToPost.me_Id;
    params['me_type'] = dataToPost.me_type;
    var path = '/me';
    fbGraph.setAccessToken(dataToPost.accessToken);
    fbGraph.extendAccessToken({
        "access_token": dataToPost.accessToken
        , "client_id": config.facebookAuth.client_id
        , "client_secret": config.facebookAuth.client_secret
    }, function (err, facebookRes) {
        //console.log(facebookRes);
        if (params.me_type) {
            if (params.me_type == 'page') {
                path += "/pages/";//+ param.me_id;
            } else { // (param.me_type == 'group') {
                path += "/groups/";//+ param.me_id;
            }//if (param.me_type == 'page') {


            if (params.picture) {
                findAlbum(path + '/albums/', 'nectorr-images', function (albumResponse) {
                    //set path in params
                    if (albumResponse && !albumResponse.error) {
                        fbGraph.post(path, params, function (err, res) {
                            if (err) {
                                message['status'] = "ERROR";
                                message['message'] = "An error occured while posting to facebook."
                                callback(message);
                                return;
                            }//if (err) {
                            if (res) {
                                message['status'] = "SUCCESS";
                                message['message'] = "Successfully posted to facebook."
                                callback(message);
                                return;
                            }//if (res) {
                        });//fbGraph.post(dataToPost.postToString, post, function (err, res) {
                    }
                });//findAlbum(path, params.me_id, function (response) {
            } else {
                fbGraph.post(params.path + params.me_id, params, function (err, res) {
                    if (err) callback({ status: "ERROR", data: "There was an error in posting... Please try after sometime." });
                    if (res) calback({ status: "SUCCESS", message: "Posted successfully on facebook.", data: fbResponse.data });
                })//fbGraph.post(params.path + params.me_id, params, function (err, res) {
            }
        } else {
            fbGraph.post(path, params, function (err, res) {
                if (err) {
                    message['status'] = "ERROR";
                    message['message'] = "An error occured while posting to facebook. Code - " + err.code;
                    callback(message);
                    return;
                }//if (err) {
                if (!res.error) {
                    message['status'] = "SUCCESS";
                    message['message'] = "Successfully posted to facebook."
                    callback(message);
                    return;
                }//if (res) {
            });//fbGraph.post(dataToPost.postToString, post, function (err, res) {
        }//if (param.me_type) {
    });//fbGraph.extendAccessToken({
}//var postToFacebook = function (options, accessToken) {

var getStringForPost = function (data) {
    if (data == "me") {
        return "me/feed"
    }
};
var getFBAccessToken = function (callback) {
    var accesstokenuri = "https://graph.facebook.com/dialog/access_token" + "?client_id=" + config.facebookAuth.client_id + "&client_secret=" + config.facebookAuth.client_secret + "&grant_type=client_credentials";
    request.post(accesstokenuri, function (error, response, body) {
        if (!error) {
            if (callback) {
                callback({ accessToken: body.split("=")[1]});
            }
            //callback(body)
        }
    });
    
    //passport.use("facebook", new FacebookStrategy({

    //    // pull in our app id and secret from our auth.js file
    //    'clientID': config.facebookAuth.client_id
    //    , 'clientSecret': config.facebookAuth.client_secret

    //},
    //    function (token, refreshToken, profile, done) {
    //        if (callback)
    //            callback({ accessToken: token, 'refreshToken': refreshToken, userProfile, profile });
    //    }) //function (token, refreshToken, profile, done) {
    //);//passport.use("facebook", new FacebookStrategy({
    //passport.authenticate('facebook', {scope:['user_posts','manage_pages']},function (req,res) {
    //    var a = data;
    //});
}//var getFBAccessToken = function (callback) {

var getTwitterBearerToken = function (callback) {

}//var getTwitterBearerToken = function (callback) {

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

var sendMessageToServer = function (msg, callback, res, post = false) {
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
    var response = JSON.stringify(msg);
    //res.writeHead(200, { 'Content-Type': 'text/plain', 'Content-Length': +response.length + '' });
    if (!post) {
        var returnValue = callback + '(' + response + ')';
        res.send(returnValue);
        res.end();
    } else {
        res.write(returnValue);
        res.end();
    }
}

var consumer_key = config.twitter.consumer_key;
var consumer_secret = config.twitter.consumer_secret;
//var enc_secret = new Buffer(consumer_key + ':' + consumer_secret).toString('base64');
var enc_secret = new Buffer(consumer_key + ':' + consumer_secret).toString('base64');
var oauthOptions = {
    url: 'https://api.twitter.com/oauth2/token', //https://api.twitter.com/oauth/access_token
    //url: 'https://api.twitter.com/oauth/access_token',
    headers: { 'Authorization': 'Basic ' + enc_secret, 'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8' },
    body: 'grant_type=client_credentials'
};
var getBearerCode = function(callback) {
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

var findAlbum = function (albumPath,albumName, callback) {
    if (callback) {
        fbGraph.get(albumpath+albumName, function (fbResponse) {
            if (fbResponse &&!fbResponse.error) {
                callback({data : fbResponse});
            } else {
                callback({ error: true, data: fbResponse })

            }//if (fbResponse &&!fbResponse.error) {
        });
    }//if (callback) {
}//var findAlbum = function (albumName, callback) {

var createAlbum = function (albumPath, albumName, callback) {
    if (callback) {
        fbGraph.post(albumPath + albumName, function (fbResponse) {
            if (fbResponse && !fbResponse.error) {
                callback({ data: fbResponse });
            } else {
                callback({ error: true, data: fbResponse });
            }//if (fbResponse && !fbResponse.error) {
        }); //fbGraph.post(albumPath + albumName, function (fbResponse) {
    }//if (callback) {
}//var createAlbum = function (albunPath, albumName, callback) {


var uploadImages = function (albumPath, albumName, imageUrl,callback) {

}//var uploadPhoto = function (albumPath, albumName, callback) {

var uploadVideo = function (albumPath, albumName, videoUrl,callback) {

}//var uploadVideo = function (albumPath, albumName, callback) {

module.exports = router;