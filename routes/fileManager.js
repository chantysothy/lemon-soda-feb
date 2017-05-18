var express = require('express');
var router = express.Router();
var fs = require('fs');
var multer = require('multer')
//vignettes
var userModel = require('../models/user');
var vignetteModel = require('../models/vignettes');
var userUtils = require('../utils/userUtils');
var userPosts = require('../models/userposts'); 

var config = require('../config/config');

var imageFileBasePath = '../lemon-soda-jan/public/upload/images', videoFileBasePath = "../lemon-soda-jan/public/upload/videos";
var imagePublishPath = '../upload/images', videoFilePublishPath = '../upload/videos';

var uploader = multer(
    {
        dest: imageFileBasePath
    });

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
});//router.get('/upload/delete', function (req, res) {
//var upload = require('fileupload').createFileUpload(imageFileBasePath).middleware;
router.post('upload/files-new',function(req,res,next){
    //var upload = require('fileupload').createFileUpload(imageFileBasePath).middleware;
    var fstream;
    req.pipe(req.busboy);
    req.busboy.on('file', function (fieldname, file, filename) {
        console.log("Uploading: " + filename);

        //Path where image will be uploaded
        fstream = fs.createWriteStream(imageFileBasePath+"\/" + filename);
        file.pipe(fstream);
        fstream.on('close', function () {
            console.log("Upload Finished of " + filename);
            var response = {
                status: "SUCCESS", message: "File uploaded.", data: {
                    originalFileName: filename,
                    serverFileName : serverFileName
                }
            }//var response = {
        });
    });    
});//router.post('upload/files', upload.single('file'), function (req, res, next) {

router.post('/upload/files', function (req, res) {
    var fileSize = req.headers['content-length'];
    var fstream;
    req.pipe(req.busboy);
    req.busboy.on('file', function (fieldname, file, filename) {
        console.log("Uploading: " + filename);
        var fileType = getFileType(filename);
        //Path where image will be uploaded
        var tempFileName = Date.now().toString() + '-' + filename;
        var serverFileName, publishUrl
        if (fileType == 'IMAGE_FILE') {
            serverFileName = imageFileBasePath + "\/" + tempFileName;
            publishUrl = imagePublishPath + "\/" + tempFileName
        } else if (fileType == 'VIDEO_FILE') {
            serverFileName = videoFileBasePath + "\/" + tempFileName;
            publishUrl = videoFilePublishPath + "\/" + tempFileName
        } else {
            res.send({ status: 'ERROR' , message: "file format not supported" });
            res.end();
            return;
        }
        //var  = imagePublishPath + "\/" + tempFileName;

        fstream = fs.createWriteStream(serverFileName);
        file.pipe(fstream);
        fstream.on('close', function () {
            console.log("Upload Finished for " + filename);
            var response = {
                status: "SUCCESS", message: "File uploaded.", data: {
                    originalFileName: filename,
                    "urlToPublish": publishUrl,
                    "serverFilePath": serverFileName,
                    "fileType": fileType
                }
                
            }//var response = {
            res.write(JSON.stringify(response));
            res.end();
        });//fstream.on('close', function () {
    });    

});//router.get('/google/profile', function (req, res) {

router.post('/upload/image', function (req, res) {
    var email = req.body.email;
    if (email) {
        var condition = { 'local.email': email }
        userModel.findOne(condition, function (err, doc) {
            if (err) {
                res.send({ status: "ERROR", message: "nectorr encountered an error while validating user : " + JSON.stringify(err) })
                res.end();
                return;
            }
            if (doc) {
                var blob = req.body.blob;
                if (blob) {
                    //var matches = blob.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/);
                    var base64Buffer = new Buffer(blob, 'base64');
                    

                    var fileName = imageFileBasePath + "/image_" + Date.now() + ".png";
                    fs.writeFile(fileName, base64Buffer, function (error) {
                        if (error) {
                            res.send({ status: "ERROR", message: "error occured while creating .png file. " + JSON.parse(error) })
                            res.end()
                            return;
                        } else {
                            res.send({ status: "SUCCESS", message: ".png file created.", data: fileName })
                            res.end();
                            return;
                        }//if (error) {
                    });
                } else {
                    res.send({ status: "ERROR", message: "unable to fetch blob for .png file." });
                    res.end();
                    return;
                }
            }//if (doc) {
        });//userModel.findOne(condition, function (err, doc) {

    }//if (email) {
});//router.post('/upload/files', function (req, res) { 

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
var getFileType =  function(filename) {
    var ext = getExtension(filename);
    switch (ext.toLowerCase()) {
        case 'jpg':
        case 'gif':
        case 'bmp':
        case 'png':
            //etc
            return "IMAGE_FILE";
    }
    switch (ext.toLowerCase()) {
        case 'm4v':
        case 'avi':
        case 'mpg':
        case 'mp4':
            // etc
            return "VIDEO_FILE";
    }
    return "NOT_SUPPORTED"
}

var getExtension = function (fileName) {
    if (fileName)
        return fileName.split('.')[1].trim();
    else return null;
}//var getExtension = function (fileName) {
module.exports = router;