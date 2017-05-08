var express = require('express');
var router = express.Router();
var request = require('request');
var Twitter = require('twitter');
var userModel = require('../models/user');
var Configuration = require('../models/track-n-listen');
var config = require('../config/config');
var http = require('http');

var fbCallback;
var fbGraph = require('fbgraph');

router.post('/config/set', function (req, res) {
    var callback = req.body.callback;
    if (callback) {
        var paramsToSet = JSON.parse(req.body.StreamObject);
        if (paramsToSet) {
            var email = req.body.email;
            setConfigObject(email, paramsToSet, function (data) {
                //var message = { status: 'SUCCESS', message: 'There was an error locating your preferences. ', 'data' : data }
                var returnValue = callback + '(' + JSON.stringify(data) + ')';
                res.send(returnValue);
                res.end();
                return;
            });//setConfigObject(email, sm_name, configObject, function (data) {

        }//if (paramsToSet){
    }//if (callback)

});

router.post('/user-config/set', function (req, res) {
    //var callback = req.query.callback;
    //if (callback) {
        var paramsToSet = JSON.parse(req.body.StreamObject);
        if (paramsToSet) {
            var email = req.body.email;
            setConfigObject(email, paramsToSet, function (data) {
                //var message = { status: 'SUCCESS', message: 'There was an error locating your preferences. ', 'data' : data }
                var returnValue = callback + JSON.stringify(data);//'(' + JSON.stringify(data) + ')';
                res.send(returnValue);
                res.end();
                return;
            });//setConfigObject(email, sm_name, configObject, function (data) {

        }//if (paramsToSet){
    //}//if (callback)
});//router.get('/user-config/set', function (req, res) { 

router.get('/user-config/get', function (req, res) {
    var callback = req.query.callback;
    if (callback) {
        var message;
        var condition = { user_id: req.query.email }
        Configuration.findOne(condition, function (err, foundUser) {
            if (err) {
                message = { status: 'ERROR', message: 'There was an error locating your preferences. ' }
                var returnValue = callback + '(' + JSON.stringify(message) + ')';
                res.send(returnValue);
                res.end();
                return;
            } else {
                if (foundUser == null) { // for first time creation
                    var configs = new Configuration();
                    configs.user_id = req.query.email;
                    configs.save(function (err, config, numRows) {

                        //var temp = err

                        if (!err) {
                            message = { status: 'SUCCESS', message: 'Configuration skeleton created ' }
                            var returnValue = callback + '(' + JSON.stringify(message) + ')';
                            res.send(returnValue);
                            res.end();
                        } else {
                            message = { status: 'ERROR', message: 'There was an error in creating configuration skeleton : '}
                            var returnValue = callback + '(' + JSON.stringify(message) + ')';
                            res.send(returnValue);
                            res.end();
                            return;
                        }
                    });
                    //Configuration.email = req.query.email;
                    //Configuration.schema.set(save();
                } else {
                    if (foundUser.StreamObject) { 
                        message = { status: 'SUCCESS', message: 'User preferences located.', StreamObject: foundUser.StreamObject }
                        var returnValue = callback + '(' + JSON.stringify(message) + ')';
                        res.send(returnValue);
                        res.end();
                        return;
                    } else {
                        message = { status: 'ERROR', message: 'No stream object located.'}
                        var returnValue = callback + '(' + JSON.stringify(message) + ')';
                        res.send(returnValue);
                        res.end();
                        return;
                    }//if (req.query.StreamObject) {
                    //return;
                }
            }
        });
    }//if (callback)

});//router.get('/user-config/set', function (req, res) { 

router.get('/stream/twitter', function (req, res) {
    var callback = req.query.callback;
    var twitterStream = [];
    if (callback) {
        var email = req.query.email;
        getTwitterStream(email, function (data) {
            if (!data.status) {
                twitterStream.push(data);
            } else {
                var status = data.status;
                var length = status.length;
                if (status.substr(length - 4, length - 1) == 'ALL') {
                    for (counter = 0; counter < data.length; counter++) {
                        var dataToSend = callback + '(' + twitterStream[counter] + ')';
                        res.send(dataToSend);
                        setTimeout(null, 200);
                    }//for (counter = 0; counter < data.length; counter++) {
                    res.end();
                } else if (data.status == 'ERROR') {
                    var dataToSend = callback + '(' + JSON.stringify(data) + ')';
                    res.send(dataToSend);
                    res.end();
                }
            }
        }); //getTwitterStream(email, function (data) {
    } //if (callback) {
}); //router.get('/stream/twitter', function (req, res) 

router.get('/stream/facebook', function (req, res) {

}); //router.get('/stream/twitter', function (req, res) {

router.get('/stream/google-plus', function (req, res) {

}); //router.get('/stream/twitter', function (req, res) {

router.get('/stream/youtube', function (req, res) {
}); //router.get('/stream/twitter', function (req, res) {

router.get('/stream/instagram', function (req, res) {

}); //router.get('/stream/instagram', function (req, res) {

var setConfigObject = function (email, configObject, callback) {
    if (callback) {
        var user = new userModel();
        var message;
        var condition = { 'local.email': email };
        userModel.findOne(condition, function (err, foundUser) {
            if (err) {
                message = { status: 'ERROR', message: 'There was an error locating your credentials. ' + err.message }
                callback(message);
                return;
            } else {
                var config = {user_id : email}; 
                Configuration.findOne(config, function (err, foundUser) {
                    if (!foundUser) {
                        var newConfig = new Configuration();
                        newConfig.email = email;
                        newconfig.StreamObject = configObject;
                        newConfig.save(function (err) {
                            message = { status: 'SUCCESS', message: 'User preferences updated.'}
                            callback(message);
                            return;
                        });
                    }//if (!foundUser) {
                    if (err) {
                        message = { status: 'ERROR', message: 'There was an error in locating your credentials. ' + err.message }
                        callback(message);
                        return;
                    } else {
                        foundUser.StreamObject = configObject;
                        foundUser.save(function (err) {
                            if (!err) {
                                message = { status: 'SUCCESS', message: 'User credentials validated and updated.', data: JSON.stringify(foundUser._doc) }
                                callback(message);
                                return;
                            } else {
                                message = { status: 'ERROR', message: 'There was an error in updating your preferences. ' + err.message }
                                callback(message);

                                return;
                            }// if (!err)
                        });
                    }//if (err) { } else {
                });//config.findOne(condition, function (err, foundUser) {
            } //if (err) {
        });
    }//if (callback) {
}; //var setConfigObject = function (email, sm_name, configObject, callback) {

var getTwitterStream = function (email, callback) {
    if (callback) {
        var message;
        var condition = { "local.email": email };
        userModel.findOne(condition, function (err, userObject) {
            if (err) {
                message = {
                    status: "SUCCESS", message: "There was an err locating your login credentials."
                }
                callback(message);
                
            } else {
                var configuration = new Configuration();
                Configuration.findOne({ 'user_id': email }, function (err, foundUser) {
                    if (foundUser) {
                        var streamObject = foundUser.StreamObject;
                        var twitterPreferences = streamObject;
                        if (twitterPreferences.Tracking && (twitterPreferences.Tracking!= "")) {
                            var track = twitterPreferences.Tracking;
                            var hashTags = twitterPreferences.ListenTo;
                            var locations = twitterPreferences.Locations;
                            var users = twitterPreferences.Users;
                            //var startDate = twitterPreferences.Dates.StartDate;
                            //var endDate = twitterPreferences.Dates.EndDate;
                            streamHashTags(userObject,foundUser, hashTags, callback);
                            //                    streamUsers(twitter, users, callback);
                            //                    streamLocations(twitter, locations, callback);
                            //                    streamTrack(twitter, track, callback);
                        } else {
                            message = { status: 'ERROR', message: 'twitter Preferences not set. ' }
                            callback(message);
                            return;
                        }//if (twitterPreferences) {
                    } else {
                        message = { status: 'ERROR', message: 'Unable to locate your twitter streaming preferences. ' }
                        callback(message);
                        return;

                    }//if (foundUser) {

                }); // Configuration.findOne(.....


            }//if (err) {
        }); //userModel.findOne(condition...
    }
 //if(callback){

}//var getTwitterStream = function (email, callback) {

var streamUsers = function (twitter, users, callback) {
    if (users && callback) {
        twitter.stream('user', { track: users }, function (stream) {
            stream.on('data', function (data) {
                //console.log(data);
                callback(data);
            }); //stream.on('data', function (data) {
            stream.on('end', function (response) {

                callback({ status: 'EOT_TWITTER_USERS', message: 'End of Transmission for User Stream.' });
            }); //stream.on('end', function (response) {
            stream.on('destroy', function (response) {
                callback({ status: 'TWITTER_USER_STREAM_DESTROYED', message: 'User Stream destroyed... reconnect now...' });
                // Handle a 'silent' disconnection from Twitter, no end/error event fired 
            }); //stream.on('destroy', function (response) {
            // Disconnect stream after five seconds 
            setTimeout(stream.destroy, 5000);
        }); //twitter.stream('user', { track: users }, function (stream) {
    } else {
        callback({status: 'ERROR',message: 'User or callback missing for twitter stream.'});
    }//if (users && callback){
}//var streamUsers = function (twitter, users, callback) {

var streamLocations = function (twitter, locations, callback) {
    if (locations && callback) {
        twitter.stream('statuses/filter', { 'locations': locations }, function (stream) {
            stream.on('data', function (data) {
                //console.log(data);
                callback(data);
            }); //stream.on('data', function (data) {
            stream.on('end', function (response) {

                callback({ status: 'EOT_TWITTER_LOCATIONS', message: 'End of Transmission for User location streams.' });
            }); //stream.on('end', function (response) {
            stream.on('destroy', function (response) {
                callback({ status: 'TWITTER_LOCATIONS_STREAM_DESTROYED', message: 'User Stream destroyed... reconnect now...' });
                // Handle a 'silent' disconnection from Twitter, no end/error event fired 
            }); //stream.on('destroy', function (response) {
            // Disconnect stream after five seconds 
            setTimeout(stream.destroy, 5000);
        }); //twitter.stream('user', { track: users }, function (stream) {
    } else {
        callback({ status: 'ERROR',message: 'Locations or callback missing for twitter stream.'});
    }//if (locations && callback){
}//var streamUsers = function (twitter, users, callback) {

var streamHashTags = function (userInfo, config,  hashtags, callback) {
    if (userInfo && config && hashtags && callback) {
        var twitter = new Twitter(config.twitter);
        //twitter.get(
        //twitter.search(hashtags, {}, function (err, data) {
        //    console.log(data);
        //});
        //twitter.
        var streamConfig = {
            screen_name : userInfo.twitter.screen_name
            , track: hashtags
        };
        twitter.stream('statuses/filter', streamConfig , 
            function (stream) {
                stream.on('error', function (response) {
                    //console.log(response);
                    callback({
                        status: 'ERROR', message: 'TWITTER CONNECTION ERROR : ' + response
                    });
                    // Handle a 'silent' disconnection from Twitter, no end/error event fired 
                }); //stream.on('destroy', function (response) {
                // Disconnect stream after five seconds 
                stream.on('data', function (data) {
                    //console.log(data);
                    callback(data);
                }); //stream.on('data', function (data) {
                stream.on('end', function (response) {
                    callback({ status: 'EOT_TWITTER_ALL', message: 'End of Transmission for track streams.' });
                }); //stream.on('end', function (response) {
                stream.on('destroy', function (response) {
                    callback({ status: 'TWITTER_ALL_STREAM_DESTROYED', message: 'User Stream destroyed... reconnect now...' });
                    // Handle a 'silent' disconnection from Twitter, no end/error event fired 
                }); //stream.on('destroy', function (response) {
                // Disconnect stream after five seconds 
                //setTimeout(stream.destroy, 5000);
            }
        );
    }//if (hashtags &&callback){
}//var streamHashTags = function (twitter, users, callback) {

var streamTrack = function (twitter, track, callback) {
    twitter.stream('statuses/filter', { 'track': track }, function (stream) {
        stream.on('data', function (data) {
            //console.log(data);
            callback(data);
        }); //stream.on('data', function (data) {
        stream.on('end', function (response) {

            callback({ status: 'EOT_TWITTER_ALL', message: 'End of Transmission for track streams.' });
        }); //stream.on('end', function (response) {
        stream.on('destroy', function (response) {
            callback({ status: 'TWITTER_ALL_STREAM_DESTROYED', message: 'User Stream destroyed... reconnect now...' });
            // Handle a 'silent' disconnection from Twitter, no end/error event fired 
        }); //stream.on('destroy', function (response) {
        // Disconnect stream after five seconds 
        setTimeout(stream.destroy, 5000);
    }); //twitter.stream('user', { track: users }, function (stream) {
}//var streamUsers = function (twitter, users, callback) {

module.exports = router;
