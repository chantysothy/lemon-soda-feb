var config = require('../config/config');
var database = require('../config/database');
var async = require('asyncawait/async');
var await = require('asyncawait/await');
var twitterMediaUploader = require('./twitterMediaUploader');

module.exports = {
    sm_utils : {
        'facebook': {
            _oAuth: null,
            _tokens: {},
            refresh_oAuth: function () {

            },
            refresh_tokens: function () {

            }
        },
        'twitter': {
            _oAuth: null,
            _bearerToken: null,
            _tokens: {},
            getAuth: function () {
                var consumer_key = config.twitter.consumer_key;
                var consumer_secret = config.twitter.consumer_secret;
                var enc_secret = new Buffer(consumer_key + ':' + consumer_secret).toString('base64');

                var oauthOptions = {
                    url: 'https://api.twitter.com/oauth2/token', //https://api.twitter.com/oauth/access_token
                    //url: 'https://api.twitter.com/oauth/access_token',
                    headers: { 'Authorization': 'Basic ' + enc_secret, 'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8' },
                    body: 'grant_type=client_credentials'
                };
                await(request.post(oauthOptions, function (e, r, body) {
                    var bearerBody = JSON.parse(body);
                    process.env.TWITTER_BEARER_TOKEN = bearerBody.access_token;
                    _bearerToken = bearerBody;
                    return bearerBody
                }));//await(request.post(oauthOptions, function (e, r, body) {
                
            },
            postMediaToTwitter: function (mediaInfo,locInfo,callback) {
                twitterMediaUploader(dataToPost, locInfo, function (data) {
                    if (callback) {
                        callback(data);
                    }//if (callback) {
                });//twitterApiMediaUpload
            },
            refresh_oAuth: function () {

            },
            refresh_tokens: function () {

            },
            'google': {
                _oAuth: null,
                _tokens: {},
                refresh_oAuth: function () {

                },
                refresh_tokens: function () {

                }
            },
            'linkedIn': {
                _oAuth: null,
                _tokens: {},
                refresh_oAuth: function () {

                },
            }
        }//var sm_utils = {
    } //module.exports
}
//module.exports = sm_utils;