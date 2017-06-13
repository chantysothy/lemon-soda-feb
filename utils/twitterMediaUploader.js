var async = require('asyncawait/async');
var await = require('asyncawait/await');
var Promise = require('bluebird');
var requestPromise = require('request-promise');
var request = require('request');
var fs = require('fs');

var smUtils = require('../utils/smUtils');

const bufferLength = 1000000, bufferCursor = 0;
const twitterBuffer = new Buffer(bufferLength);
const uploadUrl = "";
var offset , media = null;

function TwitterApiMediaUpload() {
    offset = 0;
};//var TwitterApiMediaUpload = function () {


TwitterApiMediaUpload.prototype.UploadOld = function (dataToPost, locs, callback) {
    async.series([function (args) {
        var oAuth = smUtils.twitter.getAuth();
        //INIT
        request.post({
            url: "https://upload.twitter.com/1.1/media/upload.json"
            , oauth: oauth
            , host: "upload.twitter.com", protocol: "https:"
            , formData: {
                command: "INIT"
                , media_type: args.mime
                , total_bytes: args.size
            },
        },
            function (err, res, body) {
                media = JSON.parse(body);
        });

    },
        function (oauth, args) {
            var dataForTwitter, readFile = true;
            var fd = fs.openSync(args.path, 'r');
            while (readFile) {
                var bytesRead = await(fs.readSync(fd, twitterBuffer, bufferCursor, bufferLength, null));
                if ((bytesRead > 0) && (bytesRead == bufferLength)) {

                } else if ((bytesRead > 0) && (bytesRead < bufferLength)) {
                    dataForTwitter = twitterBuffer;
                } else {
                    dataForTwitter = twitterBuffer.slice(0, bytesRead);
                    readFile = false;
                }
                
                await(request.post({
                    url: "https://upload.twitter.com/1.1/media/upload.json", oauth: oauth, host: "upload.twitter.com", protocol: "https:",
                    formData: {
                        command: "APPEND",
                        media_id: JSON.parse(media).media_id,
                        "oauth": oauth,
                        segment_index: bufferCursor,
                        media: data.toString('base64')
                    },
                    headers: {
                        'Content-Transfer-Encoding': 'base64'
                    }
                }, function (err, res, body) {
                    if (err) {
                        throw err;
                    }
                }) //request.post
                );//await(request
                bufferCursor += bytesRead;
            }//while (readFile
        },
        function (oauth, callback) {
            request.post({
                url: "https://upload.twitter.com/1.1/media/upload.json"
                , "oauth": oauth
                , host: "upload.twitter.com", protocol: "https:"
                , formData: {
                    command: "FINALIZE"
                    , media_id: media
                },
            },
                function (err, res, body) {
                    if (!error)
                    media = JSON.parse(body);
                });
        }
    ]);//async.series([function () {
}//function twitterApiVideoUpload(args) {


var InitializeTwitterMediaUpload = function (args) {
    var oAuth = smUtils.twitter.getAuth();
    //INIT
    request.post({
        url: "https://upload.twitter.com/1.1/media/upload.json"
        , oauth: oauth
        , host: "upload.twitter.com", protocol: "https:"
        , formData: {
            command: "INIT"
            , media_type: args.mime
            , total_bytes: args.size
        },
    },
        function (err, res, body) {
            if (err) {
                return { satus: "ERROR", message: "Error in twitter file upload initialize." }

            } else {
                return { satus: "SUCCESS", message: "File upload Initialized.", data: media }
            }
        });

}//var InitializeTwitterMediaUpload = function (args) {
var finalizeTwitterUpload = function (dataToPost, args) {

}//var finalizeTwitterUpload = function (dataToPost, args) {

var uploadTwitterFileChunks = function (dataToPost, args) {
    //recurse 

}//

var uploadInit = function (args) {
    return Promise((resolve, reject) => {
        var oAuth = smUtils.twitter.getAuth();
        //INIT
        request.post({
            url: "https://upload.twitter.com/1.1/media/upload.json"
            , oauth: oauth
            , host: "upload.twitter.com", protocol: "https:"
            , formData: {
                command: "INIT"
                , media_type: args.mime
                , total_bytes: args.size
            },
        },
            function (err, res, body) {
                if (body.error) {
                    reject({ satus: "ERROR", message: "Error in twitter file upload initialize. ERROR - "+JSON.stringify(err) })
                } else {
                    resolve({ satus: "SUCCESS", message: "File upload Initialized.", data: JSON.parse(body) });
                }//media = JSON.parse(body);
            });//request.post({

    });
}//var uploadInit = function (args) {
var writeFile = function (fileId) {
}//var writeFile = function (fileId) {
module.exports = TwitterApiMediaUpload;