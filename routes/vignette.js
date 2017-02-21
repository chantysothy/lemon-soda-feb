var express = require('express');
var router = express.Router();
var userModel = require('../models/user');
var vignetteModel = require('../models/vignettes');

var config = require('../config/config');
router.post('/vignette/set', function (req, res) {
    var callback = req.body.callback;
    if (callback) {
        var email = req.body.email;
        if (email) {
            var vignetteInfo = req.body.vignetteInfo
            if (vignetteInfo) {
                var condition = { 'email': email };
                var data = vignetteInfo;
                var vignetteName = req.body.vignette_name;
                vignetteModel.findOne(condition, function (err, doc) {
                    if (err) {
                        var message = { status: "ERROR", message: "There was an error in locating your vignette information. Please try after some time." }
                        sendMessageToServer(message, callback, res);
                        return;
                    }//if (err) {
                    if (doc) {
                        doc.data = data;
                        doc.save(function (err, vignette, numRows) {
                            if (err) {
                                var message = { status: "ERROR", message: "There was an error in updating your vignette information. Please try after some time." }
                                sendMessageToServer(message, callback, res);
                            } else {
                                var message = { status: "SUCCESS", message: "Your vignette Info has been successfully updated." }
                                sendMessageToServer(message, callback, res);
                            }//if (err) {
                        });//doc.save(function (err, user, numRows) {
                    } else {
                        //first time
                        var vignette = new vignetteModel({
                            'email': email
                            , vignette_name: vignetteName
                            , 'data': vignetteInfo

                        });
                        vignette.save(function (err, doc, numRows) {
                            if (err) {
                                var msg = { status: "ERROR", message: "An error occured while creating a new vignette. Please try after sometime." }
                                sendMessageToServer(msg, callback, res)
                            } else {

                                var msg = { status: "SUCCESS", message: "A new vignette was created." }
                                sendMessageToServer(msg, callback, res)
                            }//if (err) {
                        });//vignette.save(function (err, doc, numRows) {
                    }//if (doc) {
                });

            }//if (vignetteInfo) {
        }//if (email) {
    }//if (callback) {
});//router.get('/vignette/save', function (req, res) {

router.get('/vignette/get', function (req, res) {
    var callback = req.body.callback;
    if (callback) {
        var email = req.body.email;
        if (email) {
            var condition = { 'email': email };

            vignetteModel.findOne(function (condition, err, doc) {
                if (err) {
                    var message = { status: "ERROR", message: "There was an error in locating your vignettes. Please try after some time." }
                    sendMessageToServer(message, callback, res);
                    return;
                }//if (err) {
                if (doc) {
                    var message = { status: "SUCCESS", message: "Your vignettes were successfully located.", data: doc._doc }
                    sendMessageToServer(message, callback, res);
                } else {
                    var message = { status: "ERROR", message: "No vignettes were found for this login.", data: doc._doc }
                    sendMessageToServer(message, callback, res);
                }//if(doc){
            });//vignetteModel.findOne(function (condition, err, doc) {

        }//        if (email) {
    }//    if (callback) {
});//router.get('/vignette/save', function (req, res) {


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
