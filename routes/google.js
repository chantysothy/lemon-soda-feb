var express = require('express');
var router = express.Router();

var userModel = require('../models/user');
var userUtils = require('../utils/userUtils');

var config = require('../config/config');
router.get('/google/profile', function (req, res) {

    //read profile 
    var profile, _id, time, headerValue;
    var callback = req.query.callback;
    var cookie = req.cookies;
    if (callback) {
        profile = req.query.googlePlusProfile + '"}}';
        profile = JSON.parse(profile);

        //userModel.bind(userModel.googlePlusProfile, req.query.googlePlusProfile.toArray());
        if (!profile.id) {
            var errorMessage = { 'ERROR' : 'Invalid profile id recieved by nectorr server.' };
            res.send(callback + "({status : " + JSON.stringify(errorMessage) + "})");
            res.end();
            return;

        } //if (!profile.id) {
        userModel.findOne({ 'googlePlusUser.id' : profile.id }, null, function (err, result) {
                if (result) {
                    //res.setHeader("nv", );
                    var successMessage = { "status" : { "success" : "profile found." } };
                    var cookieMessage = { "nv": { "nv" : userUtils.prototype.CreateCookieValueForUser(result._id.toString()) } };
                    var responseMessage = JSON.stringify({ success: JSON.stringify(successMessage), nv : cookieMessage });
                    res.send(callback + '(' + responseMessage + ')');
                    res.end();
                    return;
                } else {
                    
                    //userModel
                    var newUser = new userModel();
                    newUser.googlePlusUser.email = profile.email;
                    newUser.googlePlusUser.aboutMe = profile.aboutMe;
                    newUser.googlePlusUser.circledByCount = profile.circledByCount;
                    newUser.googlePlusUser.cover = profile.cover;
                    newUser.googlePlusUser.displayName = profile.displayName;
                    newUser.googlePlusUser.gender = profile.gender;
                    newUser.googlePlusUser.id = profile.id;
                    newUser.googlePlusUser.image = profile.image;
                    newUser.googlePlusUser.isPlusUser = profile.isPlusUser;
                    newUser.googlePlusUser.language = profile.language;
                    newUser.googlePlusUser.name = profile.name;
                    newUser.googlePlusUser.objectType = profile.objectType;
                    newUser.googlePlusUser.occupation = profile.occupation;
                    newUser.googlePlusUser.organizations = profile.organizations;
                    newUser.googlePlusUser.placesLived = profile.placesLived;
                    newUser.googlePlusUser.result = profile.result;
                    newUser.googlePlusUser.url = profile.url;
                    newUser.googlePlusUser.urls = profile.urls;
                    newUser.googlePlusUser.verified = profile.verified;
                    
                    //                res.setHeader();
                    
                    //save user
                    newUser.save(function (err) {
                        var errorMessage = { 'error' : 'Google profile not updated. Please try after sometime.' };
                        res.send(callback + "({status : " + JSON.stringify(errorMessage) + "})");
                        res.end();
                        return;
                    });
                    //Create and attach cookies
                    
                    var successMessage = { 'success' : 'Google+ profile has be created.' };
                    var cookieMessage = { "nv ": userUtils.CreateCookieValueForUser(newUser._id.toString()) };
                    res.send(callback + '({success: ' + JSON.stringify(successMessage) + ', nv:' + JSON.stringify(cookieMessage) + '})');
                    //res.send(callback + "(" +JSON.stringify()+")");
                    res.end();
                    return;
                
            } //if (profile.id)
        });

    }
    else {
        res.send({ error : "no support for this protocol" });
        res.end();
        return
    }
    //save to database.
}); //router.get('/auth/facebook', function (req, res) { 
router.get('/google/youtube', function () { 

}); //router.get('/google / youtube ', function () { 
router.get('/google/gplus', function (req, res) { 

}); //router.get('/google/gplus', function (req, res) { 
module.exports = router;