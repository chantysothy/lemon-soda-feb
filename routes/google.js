var express = require('express');
var router = express.Router();

var userModel = require('../models/user');
var userUtils = require('../utils/userUtils');

var config = require('../config/config');
router.post('/google/profile', function (req, res) {

    //read profile 
    var profile, _id, time, headerValue;
    //var callback = req.query.callback;
    var cookie = req.cookies;
    //if (callback) {
        profile = req.body.googlePlusProfile;//+ '"}}';
        profile = JSON.parse(profile);

        //userModel.bind(userModel.googlePlusProfile, req.query.googlePlusProfile.toArray());
        if (!profile.id) {
            var errorMessage = { status : 'ERROR' , message : 'Invalid Google+ profile recieved detected. Login with the correct Google+ profile.' };
            res.send(JSON.stringify(errorMessage));
//            res.send(callback + '('+JSON.stringify(errorMessage)+')');
            res.end();
            return;

        } //if (!profile.id) {
        userModel.findOne({ 'local.email' : profile.email}, null, function (err, result) {
            if (result) {
                if (result.googlePlusUser.profileInfo.id == profile.id) {
                    result.googlePlusUser.profileInfo = profile;
                    result.save(function (err, doc, numberRec) {
                        if (!err) {
                            var successMessage = { status: "SUCCESS", message: "Google+ profile successfully validated." };
                            res.send(callback + '(' + JSON.stringify(successMessage) + ')');
                            res.end();
                            return;
                        }
                    });
                } else {
                    var errorMessage = { status: 'ERROR', message: 'Google+ id not matching our records. Please choose the correct profile.' };
                    res.send(callback + "(" + JSON.stringify(errorMessage) + ")");
                    res.end();
                    return;
                } //if (result.googlePlusUser.profileInfo == profile.id) {
                    //res.setHeader("nv", );
                } else {
                    
                    //userModel
                    var newUser = new userModel();
                    newUser.googlePlusUser.profileInfo = profile;
                    newUser.local.email = profile.email;
                
                    //                res.setHeader();
                    
                    //save user
                    newUser.save(function (err) {
                        if (err) {
                            var errorMessage = {status :  'ERROR', message: 'Google+ not validated. Please try after sometime.' };
                            res.send(callback + "(" + JSON.stringify(errorMessage) + ")");
                            res.end();
                            return;
                        } else {
                            var successMessage = { status: 'SUCCESS', message: 'Google+ profile validated.' };

                            res.send(callback + "("+ JSON.stringify(successMessage) + + ')');
                            //res.send(callback + "(" +JSON.stringify()+")");
                            res.end();
                            return;

                        }
                    });
                    
                    
                
            } //if (profile.id)
        });

    //}//if (callback) {
}); //router.get('/GOOGLE/PROFILE', function (req, res) { 
router.get('/google/youtube', function () { 

}); //router.get('/google / youtube ', function () { 
router.get('/google/locs', function (req, res) { 

}); //router.get('/google/gplus', function (req, res) { 

router.post('/plus/post/write', function (req, res) { });
router.get('/plus/post/read', function (req, res) { });

router.get('/plus/collections', function (req, res) { });
router.get('/plus/collections/read', function (req, res) { });
router.post('/plus/collections/write', function (req, res) { });

router.get('/plus/circles', function (req, res) { });
router.get('/plus/circles/read', function (req, res) { });
router.post('plus/circles/write', function (req, res) { });


module.exports = router;