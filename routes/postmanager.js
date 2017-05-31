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
var fs = require('fs');
var userModel = require('../models/user');
var vignetteModel = require('../models/vignettes');
var userUtils = require('../utils/userUtils');
var userPosts = require('../models/userposts');
var config = require('../config/config');

router.get('/send/post/now', function (req, res) {
    var callback = req.query.callback;
    //var dataToPost={ url: shortUrlForServer, imgUrl: imageUrlForServer, caption= headingForServer, text: textForServer, sm_names :['facebook','twitter'] }
    if (callback) {
        var email = req.query.email;
        var dataToPost = JSON.parse(escapeSpecialChars(req.query.dataToPost));
        for (var smCounter = 0; smCounter < dataToPost.sm_names.length; smCounter++) {
            var sm_name = dataToPost.sm_names[smCounter];
            //var dataToPost;////dataToPost. postToString, caption, link, pictureLink
            switch (sm_name) {
                case 'facebook':
                    postToFacebook(dataToPost, function (serverResponse) {
                        var post = new userPosts();
                        post.email = email;
                        post.postData = dataToPost;
                        post.save(function (err, savedPost, numRows) {
                            if (!err){
                                sendMessageToServer(serverResponse, callback, res);
                            } else {
                                sendMessageToServer({ status: "ERROR", message: "Unable to save facebook post on nectorr. "+JSON.stringify(err)}, callback, res);
                            }
                        });//post.save(function (err, savedPost, numRows) {
                        
                    });//postToFacebook(dataToPost, function (serverResponse) {
                    break;
                case 'twitter':
                    postToTwitter(dataToPost, function (message) {
                        var post = new userPosts();
                        post.email = email;
                        post.postData = dataToPost;
                        post.save(function (err, savedPost, numRows) {
                            if (!err) {
                                sendMessageToServer(serverResponse, callback, res);
                            } else {
                                sendMessageToServer({ status: "ERROR", message: "Unable to save facebook post on nectorr. " + JSON.stringify(err) }, callback, res);
                            }
                        });//post.save(function (err, savedPost, numRows) {

                    });
                    break;
                case 'google':
                    var post = new userPosts();
                    post.email = email;
                    post.postData = dataToPost;
                    post.save(function (err, savedPost, numRows) {
                        if (!err) {
                            sendMessageToServer(serverResponse, callback, res);
                        } else {
                            sendMessageToServer({ status: "ERROR", message: "Unable to save facebook post on nectorr. " + JSON.stringify(err) }, callback, res);
                        }
                    });//post.save(function (err, savedPost, numRows) {

                    break;
            }//switch (sm_name) {
        }//for (var smCounter = 0; smCounter < dataToPost.sm_names.length; smCounter++){
    }//if (callback) {

});//router.get('/google/profile', function (req, res) {

router.post('/send/post/vignette', function (req, res) {
    var callback = req.body.callback;
    if (callback) {
        var email = req.body.email;
        if (email) {
            var vignettes = JSON.parse(req.body.vignettes).vignettes;
            var dataToPost = JSON.parse(req.body.dataToPost);
            dataToPost['vignettes'] = vignettes;
            var vignetteTimelines = JSON.parse(req.body.timelines);

            if (vignettes) {
                var postDateTimeArray = vignetteTimelines.timeline;
                for (var timeLineCounter = 0; timeLineCounter < vignetteTimelines.timeline.length; timeLineCounter++) {
                    var postDateTime = postDateTimeArray[timeLineCounter];
                    //postDateTime = JSON.parse(postDateTime);
                    postDateTime = postDateTime.start;
                    var postDate = postDateTime.split('T')[0];
                    var postTime = postDateTime.split('T')[1];
                    var postTime = postTime.substring(0, postTime.length - 1);
                    var postTimeArray = postTime.split(':');
                    var hh = postTimeArray[0];
                    var mm = postTimeArray[1];
                    var ss = postTimeArray[2];
                    var postDateArray = postDate.split('-');
                    var yy = postDateArray[0];
                    var mm = postDateArray[1];
                    var dd = postDateArray[2];

//                    var dateTimeForPosting = new Date(postDate + " " + postTime);//new Date(postDateTime);
                    var dateTimeForPosting = new Date(yy,mm,dd,hh,mm,ss);//new Date(postDateTime);
                    
                    var dataForScheduler = { "email": email, dataToPost: dataToPost }
                    agenda.schedule(dateTimeForPosting, email + '~' + Date.now, dataForScheduler, function (err,job) {
                        var a = job;
                        if (err) {
                            a = err;
                            return
                        }
                        if (job) {
                            var dataToPost = job.attrs.data.dataToPost
                            var email = job.attrs.data.email;
                            dataToPost["email"] = email;
                            evaluateVignetteAndPost(dataToPost, function (smStatus) {
                                if (smStatus.status == 'ERROR') {
                                    var userPost = new userPosts();
                                    userPost.email = email, userPost.postData = dataToPost;
                                    userPost.save(function (err, doc, rowsEffected) {

                                    });
                                } else {
                                    sendMessageToServer(smStatus, callback, res);
                                }
                            });
                        }
                    });
                    
                    //agenda.start();
                }//for (var timeLineCounter = 0; timeLineCounter < vignetteTimelines.length; timeLineCounter++) {
            }//if (vignette) {
        }//if (email) {
    }//if (callback) {
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

var uploadMediaToTwitter = function (pathUri, callback) {
    if (callback) {
        var client = new Twitter();
        request.get(pathUri, function (error, response, body) {
            if (!error && response.statusCode == 200) {
                client.post('media/upload', { media: body }, function (error, media, response) {
                    if (error) {
                        callback(error);
                    } else {
                        callback(response);
                    }
                });//client.post('media/upload', { media: data }, function (error, media, response) {
                // Continue with your processing here.
            }
        });
        // Make post request on media endpoint. Pass file data as media parameter
    }//if (callback) {
} //var uploadMediaToTwitter = function (pathUri) {

var getUrl = function (url, callback) {
    request.get(url, function (error, response, body) {
        if (!error && response.statusCode == 200) {
            if (callback) {
                callback(body)
            } else {
                return body;
            }
        }
    });
}

var getMediaPathForUpload = function (uploadOptions) {
    var returnValue = '/me';
    if (uploadOptions.me_type) {
        returnValue += '/' + uploadOptions.me_type + 's/' + uploadOptions.me_Id;
    }
    return returnValue;
}//var getMediaPathForUpload = function (uploadOptions) {

var uploadMediaToFacebook = function (uploadOptions, callback) {
    var returnValue, params = {};
    var mediaUploadPath = getMediaPathForUpload(uploadOptions);
    getUrl(uploadOptions.imgUrl, function (imgObject) {
    mediaUploadPath += '/photos';

    fbGraph.post(mediaUploadPath, { "url": uploadOptions.imgUrl }, function (err, imgResponse) {
        if (err) {
            callback({
                "error":
                "Error while uploading media to facebook. Code - " + err.code
            });
        } else {
            callback({
                fbImageInfo: imgResponse
            });
        }//if (err) {

    });//fbGraph.post(mediaUploadPath, {}, function (err, doc, next) {

    });//getUrl(uploadOptions.imgUrl, function (imgObject) {
}//var uploadMediaToFacebook = function(mediaUrl, callback)

var postToFacebook = function (dataToPost, callback) { //dataToPost. postToString, caption, link, pictureLink
    var message = {};
    
    //var post = { caption: dataToPost.caption, link: dataToPost.link, picture: dataToPost.pictureLink, message: dataToPost.caption };
    var params = {};
   // fbGraph.setAccessToken(dataToPost.accessToken);
    //fbGraph.get("https://graph.facebook.com/debug_token?input_token=" + dataToPost.accessToken + "&access_token=" + config.facebookAuth.app_access_token, function (fbResponse) {
    //    if (fbResponse && !fbResponse.type == "OAuthException") {
    //        var fbCmd = "https://graph.facebook.com/oauth/access_token?client_id=" + config.facebookAuth.client_id + "&client_secret=" + config.facebookAuth.client_secret + "&grant_type=fb_exchange_token&fb_exchange_token=" + dataToPost.accessToken + "&redirect_uri="+"https://nectorr.com"
    //        //fbGraph.get(fbCmd, function (cmdData) { // exchange token
    //        //    var a = cmdData;
    //        //});//fbGraph.get("https://graph.facebook.com/debug_token?input_token=INPUT_TOKEN&access_token=" + dataToPost.accessToken, function (fbResponse) {
    //    } //else {
//            callback({ status: "ERROR", message : JSON.parse(fbResponse.error) })
//        }
 //   });
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
                    message['data'] = { "postId": res, accessToken : facebookRes.access_token }
                    callback(message);
                    setTimeout(function () { },300)
                    //return;
                }//if (res) {
            });//function (err, facebookRes) {
        } else {
            callback({ status: "ERROR", message: "facebook error while obtaining access token " + extendAccessTokenError.code + ". " + extendAccessTokenError.message });
        }
    })//fbGraph.extendAccessToken({;
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

var escapeSpecialChars    = function (param) {
    return param.replace(/\\n/g, "\\n")
        .replace(/\\'/g, "\\'")
        .replace(/\\"/g, '\\"')
        .replace(/\\&/g, "\\&")
        .replace(/\\r/g, "\\r")
        .replace(/\\t/g, "\\t")
        .replace(/\\b/g, "\\b")
        .replace(/\\f/g, "\\f");
};

var postNow = function (email,dataToPost, callback) {
        //var dataToPost;////dataToPost. postToString, caption, link, pictureLink
    switch (dataToPost.sm_name) {
        case 'facebook':            
                postToFacebook(dataToPost, function (serverResponse) {
                        if (serverResponse.status == "SUCCESS") {
                        var post = new userPosts();
                        //fbGraph.post(dataToPost.urlToPost,
                        post.email = email;
                        post.postData = dataToPost;
                        post.postIdOnSocialMedia = serverResponse.data;
                        post.save(function (err, savedPost, numRows) {
                            if (!err) {
                                callback({ status: "SUCCESS", data: serverResponse });
                            } else {
                                callback({ status: "ERROR", message: "Unable to save facebook post on nectorr. " + JSON.stringify(err) });
                            }
                        });//post.save(function (err, savedPost, numRows) {
                    } else {
                            callback({ status: "ERROR", message: "Unable to post on facebook. " + serverResponse.message });
                            //log in errors
                    }//if (serverResponse.status == "SUCCESS") {
                });//postToFacebook(dataToPost, function (serverResponse) {
                break;
            case 'twitter':
                postToTwitter(dataToPost, function (message) {
                    var post = new userPosts();
                    post.email = email;
                    post.postData = dataToPost;
                    post.save(function (err, savedPost, numRows) {
                        if (!err) {
                            callback({ status: "SUCCESS", message: "Posted successfully on twitter." });
                        } else {
                            callback({ status: "ERROR", message: "Unable to save twitter post on nectorr. " + JSON.stringify(err) });
                        }
                    });//post.save(function (err, savedPost, numRows) {

                });
                break;
            case 'google':
                var post = new userPosts();
                post.email = email;
                post.postData = dataToPost;
                post.save(function (err, savedPost, numRows) {
                    if (!err) {
                        callback({ status: "SUCCESS", message: "Posted successfully on Google+" });
                    } else {
                        sendMessageToServer({ status: "ERROR", message: "Unable to save facebook post on nectorr. " + JSON.stringify(err) }, callback, res);
                    }
                });//post.save(function (err, savedPost, numRows) {

                break;
        }//switch (sm_name) {"
}

var evaluateVignetteAndPost = function (dataToPost, callback) {
    for (var vignetteCounter = 0; vignetteCounter < dataToPost.vignettes.length; vignetteCounter++) {
        var vignetteId = dataToPost.vignettes[vignetteCounter].id;
        var condition = { _id : vignetteId };
        vignetteModel.findOne(condition, function (findError, doc) {
            if (findError) {
                return;
            } else if (doc) {
                //get social media names
                var socialMediaInfo = doc.data.locs;
                //dataToPost['accessToken'] = (dataToPost.tokens) ? dataToPost.tokens.fbAccessToken : undefined;
                for (var socialMediaCounter = 0; socialMediaCounter < socialMediaInfo.length; socialMediaCounter++) {
                    var socialMediaPostDetails = socialMediaInfo[socialMediaCounter];
                    var urlToPost = getPostableUrl(socialMediaPostDetails);
                    dataToPost["urlToPost"] = urlToPost;
                    dataToPost["sm_name"] = socialMediaPostDetails.sm_name.trim();
                    dataToPost["loc"] = socialMediaInfo;
                    (!dataToPost.loc[socialMediaCounter].otherInfo.access_token) ? dataToPost["accessToken"] = dataToPost.tokens.fbAccessToken : dataToPost["accessToken"] = dataToPost.accessToken = dataToPost.loc[socialMediaCounter].otherInfo.access_token;
                    postNow(dataToPost.email, dataToPost, callback);
                }//for (var socialMediaCounter = 0; socialMediaCounter < socialMediaInfo.length; socialMediaCounter++) {
                //post
            } else {
                callback({status : "ERROR", message : "Unable to fetch the vignette deep details at the moment. Please try after sometime."})
            }//} else if (doc) {
        });

    }//for (var vignetteCounter = 0; vignetteCounter < dataToPost.vignettes.length; vignetteCounter++) {
    var getPostableUrl = function (smPostDetails) {
        var returnValue;
        switch (smPostDetails.sm_name.trim()) {
            case "facebook":
                //var others = smPostDetails.
                if (smPostDetails.type.trim() == 'page') {
                    //var otherInfo = JSON.parse(smPostDetails.otherInfo);
                    //fbGraph.setAccessToken(otherInfo.access_token);
                    returnValue = "/" + smPostDetails.postableLocId;//+ '/feed';
                    //(!smPostDetails.accessToken)?  smPostDetails["accessToken"] = otherInfo.access_token : true ;
                } else if (smPostDetails.type.trim() == 'group') {
                    returnValue = "/groups/" + smPostDetails.postableLocId
                }//if (smPostDetails.type == 'page') {
                break;
            case "twitter":

                break;
            case "google":
                break;
            case "instagram":
                break;
            case "linkedIn":
                break;
            default:

        }//switch (smPostDetails.sm_name) {
        return returnValue;
    }//var getPostableUrl = function (smPostDetails) {
}//var EvaluateVignetteAndPost = function (dataToPost) {

var validateToken = function (token, callback) {
    var commandString = "https://graph.facebook.com/debug_token?input_token=" + token + "&accesstoken=" + config.facebookAuth.app_access_token
    request.get(commandString).on('response', function (response) {
        if (response.status==200) {
            callback(response);
        }//if (callback) {
    });
}//var validateToken = function(token, callback) {

module.exports = router;