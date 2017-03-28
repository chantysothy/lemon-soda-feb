var express = require('express');
var router = express.Router();
var fs = require('fs');
//vignettes
var userModel = require('../models/user');
var vignetteModel = require('../models/vignettes');
var userUtils = require('../utils/userUtils');
var userPosts = require('../models/userposts'); 

var config = require('../config/config');

var imageFileBasePath = '../lemon-soda-jan/public/upload/images', videoFileBasePath;

router.get('/upload/path', function (req, res) {
    var callback = req.query.callback;
    if (callback) {
        var fileName = req.query.fileName;
        if (fileName) {
            fs.exists(imageFileBasePath + "/" + fileName, function (data) {
                if (data) {
                    var message = { status: 'SUCCESS', message: "file located.", data: imageFileBasePath + "/" + fileName}
                    message = callback + "(" + JSON.stringify(message) + ")";
                    res.send(message);
                    res.end();
                } else {
                    var message = { status: 'ERROR', message: "This file does not belong here." }
                    message = callback + "(" + JSON.stringify(message) + ")";
                    res.send(message);
                    res.end();
                }
            });
        }//if (fileName) {
    }//if (callback) {
});

router.get('/upload/delete', function (req, res) {
    var callback = req.query.callback;
    if (callback) {
        var fileName = req.query.file;
        if ((fileName != null) && (fileName)) {
            try {
                fs.unlinkSync(imageFileBasePath + "/" + fileName);
            } catch (e) {
                var message = { status: 'ERROR', message: "Unable to delete this file on our servers. " }
                message = callback + "(" + JSON.stringify(message) + ")";
                res.send(message);
                res.end();
                return;
            }
            var message = { status: 'SUCCESS', message: "file has been deleted." }
            message = callback + "(" + JSON.stringify(message) + ")";
            res.send(message);
            res.end();
        } else {
            var message = { status: 'ERROR', message: "There was an error in locating this file. " }
            message = callback + "(" + JSON.stringify(message) + ")";
            res.send(message);
            res.end();
        }
    }//if (callback) {
})//router.get('/upload/delete', function (req, res) {

router.post('/upload/files', function (req, res) {
    var fileSize = req.headers['content-length'];
    var originalFileName = req.body.fileName
    var email = req.headers['email'];
    var uploadedBytes = 0;

    var fileName
    getUserId(email, function (userInfo) {
        if (userInfo.status == "SUCCESS") {
            fileName = userInfo.data._id + "_" + Date.now();
            var fullFileName = imageFileBasePath + "\\" + fileName;
            var destinationFile = fs.createWriteStream(fullFileName);
            req.pipe(destinationFile);
            req.on('data', function (d) {
                uploadedBytes += d.length;
                var p = (uploadedBytes / fileSize) * 100;
                //res.body['fileName'] = fileName;
                //res.write(JSON.stringify({ status: "SUCCESS", message: "Uploading " + parseInt(p) + "%" }));
            });//request.on('data', function (d) {


            req.on('end', function () {
                res.write(JSON.stringify({status: "SUCCESS", message:"File upload complete.", data : {"fileName": fileName }}));
                res.end();
                destinationFile.close();
            });

        } else {
            res.send(JSON.stringify(userInfo));
            res.end();
        }//if (userInfo.status == "SUCCESS") {
    });// + '_' + Date.now()
});//router.get('/google/profile', function (req, res) {

var escapeSpecialChars = function (param) {
    return param.replace(/\\n/g, "\\n")
        .replace(/\\'/g, "\\'")
        .replace(/\\"/g, '\\"')
        .replace(/\\&/g, "\\&")
        .replace(/\\r/g, "\\r")
        .replace(/\\t/g, "\\t")
        .replace(/\\b/g, "\\b")
        .replace(/\\f/g, "\\f");
};

var getUserId = function (email, callback) {
    userModel.findOne({ 'local.email': email }, function (err, doc) {
        if (err) {
            callback({ status: "ERROR", message: "Unable to retrieve user information." });
        } else {
            callback({ status: "SUCCESS", data: doc._doc });
        }//if (err) {
    });
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
module.exports = router;