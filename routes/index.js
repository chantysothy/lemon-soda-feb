var express = require('express');

var nodeMailer = require('nodemailer');
var router = express.Router();
var config = require('../config/config');
var http = require('http');
var request = require('request');
var url = require('url');
var fbCallback;
var TwitterBase = require('twitter');
var Twitter = require('node-twitter-api');
var fbGraph = require('fbgraph');
var passport = require('passport');
var FacebookStrategy = require('passport-facebook').Strategy;
var TwitterStrategy = require('passport-twitter').Strategy;
//var tweets = require('./tweets');
var cheerio = require("cheerio");
var fbCode, twitterToken1, twitterToken2, twitterEmail;
var redirectOptions = {
    successRedirect: '/auth/facebook/callback',
    failureRedirect: '/auth/facebook/callback'
};/* GET home page. */
var userModel = require('../models/user');
var invitationModel = require('../models/invitation');
var transporter = nodeMailer.createTransport('smtps://connect@nectorr.in:email123@smtp.zoho.com');
var enc_secret = new Buffer(config.twitter.consumer_key + ':' + config.twitter.consumer_secret).toString('base64');
var oauthOptions = {
    url: 'https://api.twitter.com/oauth2/token', //https://api.twitter.com/oauth/access_token
    //url: 'https://api.twitter.com/oauth/access_token',
    headers: { 'Authorization': 'Basic ' + enc_secret, 'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8' },
    body: 'grant_type=client_credentials'
};
router.get('/auth/instagram/callback', function (req, res) {
    console.log("Instagram callback : " + JSON.stringify(req.query['#access_token']));
});
router.get('/get/booster-profiles', function (req, res) {
    var callback = getCallback(req);
    if (callback) {
        var userDetails = JSON.parse(req.query.userDetails);
        getBoostingProfileInfo(userDetails, function (data) {

        });//getBoostingProfileInfo(userDetails, function (data) {
    }//if (callback) {
}); //router.get('/get/booster-profiles', function (req, res) {

router.get('/get/html/old',function (req, res) {
    var callback = getCallback(req);
    if (callback) {
        var clientUrl = req.query.urlPath;
        if (clientUrl) {
            var request = require("request");
            request({
                uri: clientUrl //.host+clientUrl.path
                , json: true
            }, function (error, response, body) {

                if (!error && response.statusCode === 200) {
                    $= cheerio.load(body);
                    
                    var serverMessage = { status: 'SUCCESS', message: "URL read successfully", data: getTagsForBooster(body, clientUrl) }
                    sendMessageToServer(serverMessage, callback, res);
                }//if (!error && response.statusCode === 200) {
                });//function (error, response, body) {
        }//if (clientUrl) {
    }//if (callback) {
});//router.get('/get/html',function (req, res) {
router.get('/get/html', function (req, res) {
    var callback= getCallback(req);
    if (callback) {
        var clientUrl = req.query.urlPath;
        if (clientUrl) {
            var request = require("request");
            request({
                uri: clientUrl //.host+clientUrl.path
                ,json: true
            }, function (error, response, body) {
                var htmlJson
                if (!error && response.statusCode === 200) {

                    var serverMessage = { status: 'SUCCESS', message: "URL read successfully", data: getTagsForBooster(body, clientUrl) }
                    sendMessageToServer(serverMessage, callback, res);
                } else if (error) {
                    var serverMessage = { status: 'ERROR', message: "Unable to read the pasted url. " + error.message };
                    sendMessageToServer(serverMessage, callback, res);
                }//if (!error && response.statusCode === 200) {
            });
        }//if (url) {
    }//if (callback) {
});//router.get('get/html', function (req,res) {

router.get('/signup/invitation', function (req, res) {
    // get query params
    var encryptor = require('../utils/encryptor');
    
    var callback = getCallback(req);
    if (callback) { 
    //validate params
        var invitation_details = JSON.parse(req.query.invitation_details);
        var invitationCode = invitation_details.invitation_code;
        var invitationSchema = new invitationModel();
        invitationModel.findOne({ '_id': invitationCode }, function (err, data) {
            if (!err) {
                // send verified_code param
                if (data) {
                    var invitationUsed = data.invitation_used;
                    var invitedEmail = data.email;
                    if (invitationUsed) {
                        message = { status : 'ERROR', message : 'This invitation is invalid.' }
                        sendMessageToServer(message, callback, res);
                        return;
                    } else {
                        data.invitationUsed = true;
                        data.save(function (err) {
                            if (!err) {
                                var key = invitationCode;// encrypted
                                message = { status : 'SUCCESS', message : 'This invitation is successfully validated.', 'key' : key }
                                sendMessageToServer(message, callback, res);
                                return;

                            } else {
                                message = { status : 'ERROR', message : 'Unable to update license information.'}
                                sendMessageToServer(message, callback, res);
                                return;
                            }//if (!err) { 
                        });//data.save(function (err) {
                        //

//                            var key = encryptor.prototype.encrypt(invitationCode);
                        
                        // update invitation (data)

                    } //if (invitationUsed) { 

                }//if (data) {
            } else {
                message = { status : 'ERROR', message : err.message }
                sendMessageToServer(message, callback, res);
                return;
            } // if (err)
        }); //var isValid = invitationModel


    } 

});

router.get('/signup/invitation/validate', function (req, res) {
    var callback = getCallback(req);
    if (callback) {
        var creds = req.query.creds;
        if (creds) {
            var invitation_code = JSON.parse(creds).invitation_code;
            invitationModel.findById(invitation_code.trim() , function (err, data) {
                if (err) {
                    var returnValue = JSON.stringify({ status: 'ERROR', message: "Unable to process your request." });
                    sendMessageToServer(JSON.parse(returnValue), callback, res);
                    return;
                }
                if (data) {
                    if (data.verified_code == 'verified') {
                        var returnValue = { 'status': 'ERROR', message: 'You have provided a used invitation code.'}
                        sendMessageToServer(returnValue, callback, res);
                        return;

                    } else {
                        data.verified_code = 'verified';
                        data.save(function (err, doc, numRows) {
                            var newUser = new userModel();
                            newUser.local.email = data.email;
                            newUser.local.password = 'nectorr';
                            newUser.save(function (err, userInfo, numRows) {
                                var emailText = "Hi there, "
                                emailText += "\n\n" + "You were successfully registered at localhost:1337"
                                emailText += "\n\n ";
                                emailText += 'Your username is - ' + userInfo.local.email + ' .'
                                emailText += '\n\n';
                                emailText += 'Your password has been set to - nectorr';
                                emailText += '\n\n';
                                emailText += 'You may now login and change your password and profile information. Go, make an impact for your brand on social media for free.'
                                emailText += '\n\n';
                                emailText += 'Best Regards,';
                                emailText += '\n';
                                emailText += 'Jennifer McClain';
                                var error = sendEmail(data.email, data.email, emailText);
                                // return success message 

                                if (error) {
                                    message = { status: 'ERROR', message: 'Invitation updated to our database, however, we are unable to send email to ' + invitation_details.friendsName }
                                    sendMessageToServer(message, callback, res);
                                    return;
                                }

                                var returnValue = { 'status': 'SUCCESS', message: 'Your invitation was successfully verified. Check your email for login credentials.', data: + JSON.stringify(data) }
                                sendMessageToServer(returnValue, callback, res);
                                return;
                            });
                        });//data.save(function (err, doc, numRows) {
                    } //if (data.verified_code == 'verified') { 
                } else {
                    var returnValue = JSON.stringify({ status: 'ERROR', message:"invalid invitation." }) ;
                    sendMessageToServer(JSON.parse(returnValue), callback, res);
                    return;
                }//if (data) { 
            });//invitationModel.findOne({}, function (err, data) {
        }//if (creds) {
    } //if (callback) {
});//router.get('/signup/invitation/validate', function (req, res) {
router.get('/login/change-password', function (req, res) {
    var callback = req.query.callback;
    if (callback) {
        var email = req.query.email;
        var pwd = req.query.password;
        if (email) {
            var condition = { "local.email": email };
            userModel.findOne({ 'local.email': email }, function (err, doc) {
                if (doc) {
                    doc.local.password = pwd;
                    doc.save(function (error, doc, numAfffected) {
                        if (!error) {
                            sendMessageToServer({ status: "SUCCESS", message: "The changes were recorded successfully." },callback,res);
                        } else {
                            sendMessageToServer({ status: "ERROR", message: "An error occured while updating nectorr servers. Please try after sometime." },callback,res);

                        }
                    });//doc.save(function (error, doc, numAfffected) {
                } else {
                    sendMessageToServer({ status: "ERROR", message: "We were unable to locate your credentials. Please try after sometime." });
                }//if (doc){
            });//userModel.findOne({ 'local.email': email }, function (err, data) {
            }//if (email) {
    }//if (callback) {
}); //router.post('/login/set', function (req,res) {
router.get('/login/details', function (req, res)  {
    // get query params
    var callback = getCallback(req);
    if (callback) {
        var loginDetails = req.query.login_details;
        if (loginDetails) {
            loginDetails = JSON.parse(loginDetails);
            var email = loginDetails.user_name;
            var login = new userModel();
            if (email) {
                userModel.findOne({ 'local.email': email }, function (err, data) {
                    if (data) {
                        var message = { status: 'SUCCESS', message: 'user details located successfully.', data: JSON.stringify(data) }
                        sendMessageToServer(message, callback, res);
                        return;

                    } else {
                        var message = { status: 'ERROR', message: 'user details not available.', }
                        sendMessageToServer(message, callback, res);
                        return;
                    }
                    //if (data)
                }); //userModel.findOne
            } //else {
            //    var message = { status : 'ERROR', message : 'Invalid email id recieved by localhost:1337 server.' }
            //    sendMessageToServer(message, callback, res);
            //    return;
            //}// if (email)

        } else {
            var message = { status: 'ERROR', message: 'Invalid login details recieved.' }
            sendMessageToServer(message, callback, res);
            return;
        } //if (loginDetails) {
    } //if (callback) {
    //validate params

});
router.get('/signup/login', function (req, res) { 
    // get query params
    var callback = getCallback(req);
    if (callback) {
        var loginDetails = req.query.login_details;
        if (loginDetails) {
            loginDetails = JSON.parse(loginDetails);
            var email = loginDetails.user_name;
            var password = loginDetails.password;
            var login = new userModel();
            if (email) {
                userModel.findOne({ 'local.email': email }, function (err, data) {
                    if (data) {
                        if (data.local.password == password) {
                            var message = { status : 'SUCCESS', message : 'email and password validated successfully.' , data: data}
                            sendMessageToServer(message, callback, res);
                            return;
                        }
                        else {
                            var message = { status : 'ERROR', message : 'Invalid password.' }
                            sendMessageToServer(message, callback, res);
                            return;
                        } //if (data.password == password) { 
                    } else {
                        var invitation = new invitationModel();
                        var condition = { 'email': email };
                        //invitationModel.findOne(JSON.stringifcondition, function (err, foundInvitation) {
//                        invitationModel.findOne(JSON.stringify(condition), function (err, foundInvitation) {
                        invitationModel.findOne(condition, function (err, foundInvitation) {
                            if (foundInvitation) {
                                var newUser = new userModel();
                                newUser.local.email = email;
                                newUser.local.password = 'nectorr';
                                newUser.save(function (err) {
                                    if (err) {
                                        var message = { status : 'ERROR', message : err.message }
                                        sendMessageToServer(message, callback, res);
                                        return;
                                    } else {
                                        var message = { status : 'SUCCESS', message : 'Credentials validated successfully' }
                                        sendMessageToServer(message, callback, res); 
                                        return;

                                    }//if (err) { 
                                });
                            } else {
                                var message = { status : 'ERROR', message : 'This email is not registered with us' }
                                sendMessageToServer(message, callback, res);
                                return;
                            } //if (foundInvitation) { 
                        });

                    }//if (data)
                }); //userModel.findOne
            } //else {
            //    var message = { status : 'ERROR', message : 'Invalid email id recieved by localhost:1337 server.' }
            //    sendMessageToServer(message, callback, res);
            //    return;
            //}// if (email)

        } else {
            var message = { status : 'ERROR', message : 'Invalid login details recieved.' }
            sendMessageToServer(message, callback, res);
            return;
        } //if (loginDetails) {
    } //if (callback) {
    //validate params

});
router.get('/perms/get', function (req, res) {
    var callback = req.query.callback;
    if (callback) {
        var perms_for = req.query.getPermsFor;
        //perms_for = JSON.parse(perms_for);
        if (perms_for) {
            perms_for = JSON.parse(perms_for);
            email = perms_for.email
            userModel.findOne({ 'local.email': perms_for.email }, function (err, permsData) {
                
                if (err) {
                    var message = { status : 'ERROR', message : er.message }
                    sendMessageToServer(message, callback, res);
                    return;
                } //if (err) { 
                
                    if (permsData) {
                    var permissionData = { perm_email: email, facebook: permsData._doc.facebook, twitter: permsData._doc.twitter, linkedIn: permsData._doc.linkedin, google : permsData._doc.googlePlusUser };//googlePlusUser: permsData.googlePlusUser._doc.googlePlusUser, 
                    var message = { status: 'SUCCESS', message: 'requested data was found.', 'data': JSON.stringify(permissionData) }
                    sendMessageToServer(message, callback, res,false);
                    return;

                } //if (data) { 
            });//userModel.findOne({ 'local.email': email }, function (err, data) {
        } // if (perms_for
    }//if (callback){
});//router.get('/perms/get', function (req, res) {
router.get('/perms/set', function (req, res) {
    var callback = getCallback(req);
    if (callback) {
        var perms_for = JSON.parse(req.query.setPermsFor);
        if (perms_for) {
            var email = perms_for.userId;
            if (email) {
                userModel.findOne({ 'local.email': email }, function (err, permsData) {
                    if (err) {
                        var message = { status : 'ERROR', message : er.message }
                        sendMessageToServer(message, callback, res);
                        return;
                    } //if (err) { 
                    if (permsData) { 
                        setPermissions(perms_for, permsData, function (data) {
                            sendMessageToServer(data, callback, res);
                        });
                    } //if (data) {
                }); //userModel.findOne({ 'local.email': perms_for.email }, function (err, permsData) {    
            
            }//if (email)
        }//if (perms_for)
    }//if (callback) { 
});//router.get('/perms/get', function (req, res) 

router.get('/signup/invitation/manage', function (req, res) {
    var callback = getCallback(req);
    if (callback) {
        var invitation_details = JSON.parse(req.query.invitation_details);
        if (invitation_details) {
            var invitation = new invitationModel();
            invitation.firstName = invitation_details.friendsName;
            invitation.email = invitation_details.email;
            invitation.invitation_used = false;
            invitation.invited_by = "System"; 
            invitation.invitationType = 'Individual';//: String //individual, corporate
            invitation.verified_code = "not verified";// : String 
            invitation.invitation_used = false;//: Boolean

            var condition = {"email":  invitation_details.email  };
            invitationModel.findOne(condition, function (err, data) {
                // return user exist message
                if (data) {
                    var message = { status : 'ERROR', message : 'This email id is already registered with us.' }
                    sendMessageToServer(message, callback, res);
                    return;
                } else {
                    invitation.save(function (err, data) {
                        var datas = err;
                        var invitation_code = data._id.toString();
                        // send email
                        var emailText = "Hi there, "
                        emailText+= "\n\n"+"You have been registered on localhost:1337"
                        emailText += "\n\n ";
                        emailText += 'Your invitation code is - ' + invitation_code + ' .'
                        emailText += '\n\n';
                        emailText += 'You should register it by clicking the link below.';
                        emailText += '\n\n';
                        emailText += 'https://nectorr.com/signup?inv_code=' + invitation_code;
                        emailText += '\n\n';
                        emailText += 'Wishing you the best of social media.'
                        emailText += '\n\n';
                        emailText += 'Best Regards,';
                        emailText += '\n';
                        emailText += 'Jennifer McClain';
                        var error = sendEmail(invitation_details.friendsName, invitation_details.email, emailText);
                        // return success message 

                        if (!error) {
                            message = { status : 'SUCCESS', message : 'An email has been sent to ' + invitation_details.friendsName }
                            sendMessageToServer(message, callback, res);
                        } else {
                            message = { status : 'ERROR', message : 'Invitation updated to our database, however, we are unable to send email to ' + invitation_details.friendsName }
                            sendMessageToServer(message, callback, res);
                        }
                    });
                }
            });
        }
        else { 
            // raise invalid request response
        }
    } else { 
        // raise 401

    }//if (callback) 

});

router.get('/auth/facebook',
    passport.authenticate('facebook', {
     scope: ['public_profile', 'user_posts', 'manage_pages', 'user_managed_groups', 'user_location'] 
    , successRedirect : '/auth/facebook/callback/'
    //successRedirect : '/auth/facebook/readstream,',
    ,failureRedirect : 'auth/facebook/callback'
}));

router.get('auth/facebook/callback', function (req, res) {
    var temp = req.query;

});//router.get('auth / facebook / callback', function (req, res) {

router.post('/postable-loc/set', function (req, res) {
    var callback = req.body.callback;
    //if (callback) {
        var email = req.body.email;
        if (email) {
            var sm_name = req.body.sm_name;
            var condition = { 'local.email': email };
            userModel.findOne(condition, function (err, doc) {
                if (err) {
                    var message = { status: "ERROR", message: "There was an error in validating your profile. You may try after sometime." };
                    sendMessageToServer(message, null, res);
                    return;
                }
                if (doc) {
                    var postableLoc = JSON.parse(req.body.postLoc);
                    //if (postableLoc.status == "SUCCESS") {

                        doc[sm_name].postableLocs = postableLoc;
                        doc.save(function (err, doc, numRows) {
                            if (err) {
                                var message = { status: "ERROR", message: "Unable to update postable locations on social media automatically. You may continue with your work." };
                                sendMessageToServer(message, null, res);
                            } else {
                                var message = { status: "SUCCESS", message: "Postable locations automatically updated for - " + sm_name };
                                sendMessageToServer(message, null, res);
                            }//if (err) {

                        });//doc.save(function (err, doc, numRows) 
                    //}
                    //var message = { status: "SUCCESS", message: "User data found and validated.", data: doc._doc }
                    //sendMessageToServer(message, callback, res);
                }
            });//userModel.findOne(condition, function (err, doc) {
        }//if (email) {
    //}//if (callback) {
});//router.get('', function (req, res) {

router.post('/profile/save', function (req, res) { 
    var smProfileData = req.body.smProfile;
    if (smProfileData) {
        var email = req.body.email;
        if (email) {
            if (smProfileData) {
                var profileData = cleanClass(smProfileData);
                //var profileData = JSON.parse(smProfileData);//.fbLoginInfo;

                //var fbId = profileData.loginInfo.id;
                //var userName = profileData.loginInfo.name;
                var smName = req.body.sm_name;
                var login = new userModel();
                //smName += ".profileInfo";
                userModel.findOne({ 'local.email': email }, function (err, doc) {
                    if (err) {
                        res.send({ status: "ERROR", message: "Unable to locate user credentials." });
                        return;
                    }
                    if (doc) {
                        //                        doc[smName]['profileInfo'] = profileData;
                        // smName += '.profileInfo';
                        doc[smName].profileInfo = profileData;
                        doc.save(function (err, prod, numRows) {
                            if (err || (numRows <= 0)) {
                                res.send({ status: "ERROR", message: "Unable to update credentials." });
                                return;

                            }
                            if (numRows > 0) {
                                res.send({ status: "SUCCESS", message: "Credentials updated successfully." });
                            }
                        });
                    }//if (doc) {
                });
                //userModel.update(   
                //userModel.findOneAndUpdate({ 'local.email': email }, { smName: profileData }, {new: true }, function (err, doc) {
                //        if (err) {
                //            sendMessageToServer({ status: "ERROR", message: "An error occured while updating docs." + JSON.stringify(err) });
                //            return;
                //        }
                //        if (doc) {

                //        }
                //    });//login.findOneAndUpdate({ 'local.email': email }, {

            }//if (profileData) { 
        } //if (email)
    }//if (smProfileData){
//    } //if (callback) { 
});//router.get('', function (req, res) { 



router.get('/facebook/read/posts', function (req, res) {
    var rtVal = '{"error":';
    if (!req.query.callback) {
        res.send(rtVal+"Protocol not supported.");
        res.end();
        return;
    }

    if (req.query.error) {
       rtVal += JSON.stringify(req.query.error) + '}';
        res.send(rtVal);
        res.end();
        return;
    }
    var callback = req.query.callback
    var access_code = req.query.code;
    if (access_code) {
        var returnValue, clientFeed, userData, fbError;
        var fbOptions = config.facebookAuth;
        var scope = { 'scope' : ['email','public_profile', 'user_posts', 'manage_pages', 'user_managed_groups', 'user_location'] }
        fbGraph.authorize(
            {
                'client_id' : fbOptions.client_id
                , 'client_secret': fbOptions.client_secret
                , 'redirect_uri' : fbOptions.redirect_uri
                , 'code': access_code
            }
            , function (err, data) {
                console.log("FB graph ERROR : " + JSON.stringify(err));
                console.log("FB graph data : " + JSON.stringify(data));
                //fbAccessCode = data.access_token;
                fbGraph.setAccessToken(access_code);
                fbGraph.batch([
                    {
                        method: "GET",
                        relative_url: "me" // Get the current user's profile information 
                    },
                    {
                        method: "GET",
                        relative_url: "me/feed?limit=20" // Get the first 20 feeds
                    }
                ], function (err, batchData) {
                    if (err) {
                        res.send(rtVal += JSON.stringify(err));
                        res.end();
                        console.log(rtVal + JSON.stringify(err));
                        rtVal = "";
                        return
                    }
                    
                    console.log("BATCH DATA: " + batchData);
                    var data = '{"user_data" :' + batchData[0].body + ',"user_posts":' + batchData[1].body + '}';

                    res.send(callback+"("+data+")");
                    res.end();
                    //save data

                    //res.send(batchData);
                    //res.end();
                });
                //fbGraph.get('/me', function (err, data) {
                //    //fbGraph.get('/feed')
                //    if (!err) {
                //        userData = data;
                //        fbGraph.get('/me/home', {}, function (err, data) {
                //            if (!err) {
                //                clientFeed = data.data;
                //                returnValue = '{"userData":' + JSON.stringify(userData) + '},';
                //                returnValue += '"userFeed":' + JSON.stringify(clientFeed) + '}'
                //                res.send(returnValue);
                //                res.end();
                //            }
                //            else {
                //                console.log("fb/me/home: error" + JSON.stringify(err));
                //                fbError = err;
                //            }
                //        });
                //    }
                //    else {
                //        console.log("fb/me: error" + JSON.stringify(err));
                //        fbError = err;
                //    }
                //});
                //res.redirect('/auth/facebook/feed?access_token=' + fbAccessCode + "&cid=" + fbOptions.clientID);
            });
        if (fbError) {
            returnValue = getJSON('error', fbError);
        }

    }
    else {
        res.send('{"source":"facebook",' 
        + '"error": "no access code returned from facebook"' 
        + '} ');
        res.end();
    }

    //res.render('index', { title: 'Angular, Node and Twitter API' });
});
var getTagsForBooster = function (body,url) {
//    var tagsArray = ['title', 'imageId', 'paragraphs'];
    var tagsArray = ['h1', 'img', 'p'];
    var alternateTagsArray = ['h2', null, null];
    var attribArray = [null, 'src', null];
    var returnValue = {}
    for (var counter = 0; counter < tagsArray.length; counter++){
        var tagResult = getTagsFromHTML(tagsArray[counter], attribArray[counter], body, url);
        if (tagResult.length > 0) {
            returnValue[tagsArray[counter] + 'Tags'] = tagResult;
        } else {
            tagResult = getTagsFromHTML(alternateTagsArray[counter], attribArray[counter], body, url);
            returnValue[tagsArray[counter] + 'Tags'] = tagResult;
        }
    }//for (var counter = 0; counter < tagsArray.length; counter++){
    return returnValue;
} //var getTagsForBooster = function () {
var getTagsFromHTML = function (tag, attrib, html, page_url) {
    var returnValue = [];
    var $ = cheerio.load(html);
    var temp = $(tag);
    $(tag).each(function (i, item) {
        if (attrib != 'src') {
            returnValue.push($(item).text());
        } else {
            if (typeof page_url != undefined) {
                var relativePath = $(item).attr('src');
                url.parse(page_url);
                var host = url.parse(page_url).protocol + "//" + url.parse(page_url).hostname;
                if (relativePath) {
                    if (($(item).attr('width') > 230) && ($(item).attr('height')>230) )
                        returnValue.push(url.resolve(host, $(item).attr('src')));
                }

            } else {
                //returnValue.push(null);
            }
        }//if (attrib != 'src') {
    });
    return returnValue;
}//var getTagsFromHTML = function (tag, html) {


router.get('/twitter/get/lists', function (req, res) {
    var callback = req.query.callback;
    if (callback) {
        var email = req.query.email;
        if (email) {

            var condition = { 'local.email': email }
            userModel.findOne(condition, function (err, foundUser) {
                if (!err) {
                    var screenName = foundUser.twitter.screen_name;
                    getBearer(function (bearer) {
                        if (bearer) {
                            var token = JSON.parse(bearer).access_token; // set for breakpoint... TBR
                            var client = new TwitterBase({
                                consumer_key: config.twitter.consumer_key,
                                consumer_secret: config.twitter.consumer_secret,
                                bearer_token: token
                            });
                            client.get('lists/list', { screen_name: screenName }, function (error, lists, response) {
                                if (!error) {
                                    var message = { status: "SUCCESS", message: "lists retrieved for " + email, data: lists };
                                    sendMessageToServer(message, callback, res);
                                } else {
                                    var message = { status: "ERROR", message: " Twitter error code : " + error[0].code + "--" + error[0].message + ". Please try later." };
                                    sendMessageToServer(message, callback, res);
                                }
                            });
                        }
                    });//getBearer(function (bearer) {
                } else {
                    var message = { status: "ERROR", message: "Invalid user id detected for twitter validation." };
                    sendMessageToServer(msg, callback, res);
                }//if (!err) {
            });
        } else {
            var message = { status: "ERROR", message: "NECTORR recieved an invalid twitter request." };
            sendMessageToServer(msg, callback, res);
        }//if (email) {
    }//if (callback) {
    //console.log("Instagram callback : " + JSON.stringify(req.query['#access_token']));
});


router.get('/user/get', function (req, res) {
    var callback = req.query.callback;
    if (callback) {
        var email = req.query.email;
        if (email) {
            var condition = { 'local.email': email };
            userModel.findOne(condition, function (err, userData) {
                if (!err) {
                    var message = { status: "SUCCESS", message: "User data found.", data: userData._doc }
                    sendMessageToServer(message, callback, res,false);
                } else {
                    var message = { status: "ERROR", message: "there was an error in locating your profile info."}
                    sendMessageToServer(message, callback, res,false);

                }

            });//userModel.findOne(condition, function (err, userData) {
        }
    }//if (callback) {

});//router.get('/user/get', function (req, res) {

router.get('/postable-locs/set', function (req, res) {
    var callback = req.query.callback;
    if (callback) {
        var email = req.query.email;
        var postableLocs = req.query.postableLocs;
        try {
            postableLocs = JSON.parse(postableLocs)
        } catch (ex) {
            message = { status: "ERROR", message: "Unable to interpret data sent by the user." }
            sendMessageToServer(message, callback, res);
            return;
        }

        if (email && postableLocs) {
            getUser(email, function (userData) {
                var sm_names = Object.keys(postableLocs);
                for (var sm_counter = 0; sm_counter < sm_names.length; sm_counter++) {
                    if (userData[sm_names[sm_counter]]) {
                        userData[sm_names[sm_counter]].postableLocs = postableLocs[sm_names[sm_counter]];
                    }//if (userData[sm_names[sm_counter]]) {
                }//for (var sm_counter = 0; sm_counter < sm_names.length; sm_counter++) {
                userData.save(function (err, doc, a) {
                    var message 
                    if (!err) {
                        message = { status: "SUCCESS", message: "Postable locations data validated." };
                    } else {
                        message = {status : "ERROR", message : "There was an error in validating Postable location data. Please try after sometime."}
                    }
                    sendMessageToServer(message, callback, res);
                });
            });//getUser(email, function (userData) {
        }//if (email && postableLocs) {
    }//if (callback) {
});//router.get('/postable-loc/set', function (req, res) {

function getUserCondition(userType) {
    var returnValue = null;
    switch (userType) {
        case 'facebook':
            returnValue = 'facebook.id';
            break;
        case 'twitter':
            returnValue = 'twitter.id';
            break;
        case 'google':
            returnValue = 'google.id';
            break;
        case 'linkedin':
            returnValue = 'linkedin.id';
            break;
        case 'instagram':
            returnValue = 'instagram.id';
            break;
        default:
            returnValue = 'local.id';
    }
    return returnValue;
}

var getUser = function (email, callback) {
    var condition = { 'local.email': email }
    userModel.findOne(condition, function (err, doc) {
        if (err) {
            var message = { status: 'ERROR', message: 'There was an error locating user credentials.' }
            if (callback)
                callback(message)
            else return message;

            return;
        }//if (err)
        if (doc) {
            if (callback) {
                callback(doc);
            } else {
                return doc;
            }//if (callback) {
        }//if (doc) {
    });//userModel.findOne(condition, function (err, doc) {
}//var getUser= function (email) {

function saveUser(userType, userInfo) {
    var resMsg = {
        status : "ERROR"
        , details: ""
    };
    var userCondition = getUserCondition(userType);
    var userProfile = userInfo;
    if (!(userType) || !(userInfo)) {
    //throw new Error('Parameters missing for saving user info');
        resMsg.status = "ERROR";
        resMsg.details = 'Parameters missing for saving user info';
        return resMsg;
    }
    else {
        userModel.findOne({ userCondition : userProfile.id }, function (err, user) {
            if (err) { 
                return;
            }
            if (!user) {
                userModel.save();

            }
        });
    }
}

function readFBPosts(request, response, code) {
    var returnValue, clientFeed, userData, fbError;
    var fbOptions = config.facebookAuth;
    var scope = { 'scope' : ['public_profile', 'user_posts', 'manage_pages', 'user_managed_groups', 'user_location'] }
    fbGraph.authorize(
        {
            'client_id' : fbOptions.clientID
            , 'client_secret': fbOptions.clientSecret
            , 'redirect_uri' : fbOptions.redirect_uri
            , 'code': code
        }
            , function (err, data) {
            console.log("FB graph ERROR : " + JSON.stringify(err));
            console.log("FB graph data : " + JSON.stringify(data));
            fbAccessCode = data.access_token;
            fbGraph.setAccessToken(fbAccessCode);
            fbGraph.get('/me', function (err, data) {
                //fbGraph.get('/feed')
                if (!err) {
                    userData = data;
                    fbGraph.get('/me/home', {}, function (err, data) {
                        if (!err) {
                            clientFeed = data.data;
                            returnValue = '{status :'+"SUCCESS,"+"data :" + JSON.stringify(userData) + '},';
                            returnValue += '"userFeed":' + JSON.stringify(clientFeed) + '}'
                            sendMessageToServer(returnValue);
                        }
                        else {
                            console.log("fb/me/home: error" + JSON.stringify(err));
                            fbError = err;
                        }
                    });
                }
                else {
                    console.log("fb/me: error" + JSON.stringify(err));
                    fbError = err;
                }
            });
                //res.redirect('/auth/facebook/feed?access_token=' + fbAccessCode + "&cid=" + fbOptions.clientID);
        });
    if (fbError) {
        returnValue = getJSON('error', fbError);
    }
    else {
        returnValue = '{ "source" : "facebook"' + '"userData" : ' + JSON.Parse(JSON.stringify(userData) + ', "userFeed" : ' + JSON.stringify(clientFeed)) + '}';
    }

    //return returnValue;
}

var getCallback = function (req) {
        return req.query.callback
}//var getCallback = function (req) { 

var generateVerfiedCode = function(code) {
    if (code) {
        var encryptor = require('../utils.encryptor');
        return encryptor.encrypt(code);
    }
}//var generateVerfiedCode = funtion(code){ 

var sendEmail = function (recieverName,recieverEmail, emailText) {
    var mailOptions = {
        from: '"Jennifer McClain ??" <connect@localhost:1337>' // sender address 
        , to: recieverName+','+ recieverEmail // list of receivers 
        , subject: 'Manage social media  effectively ?' // Subject line 
        , text: emailText //plaintext body 
        , html: '' // html body 
    };
    transporter.sendMail(mailOptions, function (error, info) {
        if (error) {
            return error;
        }
        console.log('Message sent: ' + info.response);
    });
}//var sendEmail = function (senderName, recieverName,recieverEmail, text) {

var sendMessageToServer = function(msg, callback, res, post ){//= false) {
    // msg has to be a valid json object
    var payload = JSON.stringify(msg);
    //payload = payload.replace(/\\n/g, "\\n")
    //    .replace(/\\'/g, "\\'")
    //    .replace(/\\"/g, '\\"')
    //    .replace(/\\&/g, "\\&")
    //    .replace(/\\r/g, "\\r")
    //    .replace(/\\t/g, "\\t")
    //    .replace(/\\b/g, "\\b")
    //    .replace(/\\f/g, "\\f");
    //// remove non-printable and other non-valid JSON chars
    //payload = payload.replace(/[\u0000-\u0019]+/g, "");
    var response = payload;//JSON.stringify(payload);
    //res.writeHead(200, { 'Content-Type': 'text/plain', 'Content-Length': +response.length + '' });
    var returnValue;

    (callback) ? returnValue = callback + '(' + response + ')' : returnValue = response;

    if (!post) {
        res.send(returnValue);
        res.end();
    } else {
        res.write(returnValue);
        res.end();
    }
}

var getPermissionData = function (userData,email) {
    var permsDoc = userData._doc;
    var returnValue = {'email': email};
    for (var key in permsDoc) {
        var type = typeof key;
        if (key != 'local') { 
            returnValue[key] = permsDoc[key].perms;
        }//if (type == 'object') {
    }//for (var key in userData) {
    return returnValue;
}//var getPermissionData = function (userData) { 

var setPermissions = function (perms, dbData, callback) {
    var sm_name, dataType;
    if (perms && dbData) {
        
        sm_name = perms.sm_name;
        switch (sm_name) {
            case 'facebook':
                setFbLoginData(perms.data, dbData, callback);
                break;
            case 'twitter':
                setTwitterData(perms.data, dbData);
                break;
            case 'googlePlusUser':
                break;
            case 'linkedin':
                setLinkedInData(perms.data, dbData);
                break;
        } //switch (sm_name) {
    } //if (perms && data) { 
}//var setPermissions = function (perms, dbData) { 
var setLinkedInData = function (permData, dbData) {
    dbData.linkedin = permData;
    dbData.save(function (res) {
    });
}//var setLinkedInData = function (permData, dbData) {
var setTwitterData = function (permData, dbData) {
    if (permData && dbData) {
        var dataType = permData.type;
        switch (dataType) {
            case 'lists_data':
                dbData.twitter.lists = permData.data;
                dbData.save(function (res) {
                });
                break;
        }//switch (dataType) {
    }//if (permData && dbData) {
}//var setTwitterData = function(permData, dbData){

var setFbLoginData = function (permData, dbData, callback) {
    if (permData && dbData) {
        var dataType = permData.type;
        switch (dataType) {
            case 'page_data':
                var pageData = permData.data;
                setFbPageData(pageData, dbData, function (data) {
                    var message;
                    if (data) {
                        message =
                            { status: 'ERROR', message: data.message }; 
                    } else {
                        message = {
                            status: 'SUCCESS', message: 'Facebook pages info successfully updated on nectorr.'
                        }
                    }
                    callback(message);
                });
                break;
            case 'perms_data':
                var permsData = permData.data;
                setFbAccessPermission(permData, dbData);
                break;
            case 'groups_data':
                dbData.facebook.groupsData = permData;
                dbData.save(function (res) {
                    var message;
                    if (res) {
                        message = { status: 'ERROR', message: res.error }
                        //sendMessageToServer(message, callback, res);

                    } else {
                        message = { status: 'SUCCESS', message: 'Facebook groups info successfully updated on nectorr.'}
                    }//if (res.error) { 
                    if (callback) {
                        callback(message)
                    }
                });//dbData.save(function (res) {
                break; 
        } //switch (dataType) {
    } //if (permData && dbData) {
    
}//var setFbLoginData = function (permData, dbData) { 

var setFbAccessPermission = function (accessPerm, dbData) {
    if (!accessPerm || !dbData) return;
    // split permmission strings from user and db
    var permsArray = accessPerm.data.split(',');
    var dbPerms = dbData.facebook.permsData;
    for (var counter = 0; counter < permsArray.length; counter++) {
        if (dbPerms) {
            var index = dbPerms.indexOf(permsArray[counter]);
            if (index < 0) {
                dbPerms = dbPerms += ', ' + permsArray[counter];
            } //if (index < 0) {
        } else { 
            // for first time
            dbData.facebook.permsData = accessPerm.data;
            break;
        }//if (dbPerms) { 

    } //for (var counter = 0; counter < permsArray.length; counter++) {
    dbData.save(function (err, d) {
        var error = err;
        var returnValue = d;

    }); //dbData.save(function (d) {
}//var setFbAccessPermission = function (accessPerm, dbData) { 

var setFbPageData = function (pageData, dbData, callback) {
    if (!pageData || !dbData) return;
        dbData.facebook.pageData = pageData;
        dbData.save(function (data) {
            var message 
            if (data) {
                message = { status: 'ERROR', message: data }

            } else {
                message = { status: 'SUCCESS', message: 'Facebook pages info successfully updated on nectorr.' }
            }
            // return Success message
            callback(message);
        });

}//var setFbPageData = function (pageData, dbData) {
 
var setLinkedInProfileData = function (data, profileData, callback) {
    data.linkedin = profileData;
    data.save(function (err) {
        var message 
        if (err) {
            message = { status: 'SUCCESS', message: 'Linkedin profile details updated on nectorr.' }

            //sendMessageToServer(message, callback, res);
            
        } else {
            message = { status: 'ERROR', message: 'Unable to update your linkedIn profile info on nectorr.' };
            //sendMessageToServer(message, callback, res);
        }
        if (callback) {
            callback(message);
        }
    });//data.save(function (err) {
} //var setLinkedInProfileData = function (data, profileData) {
var setTwitterProfileData = function (data, profileData) {
    data.twitter = profileData;
    data.save(function (err) {
        if (!err) {
            var message = { status: 'SUCCESS', message: 'Twitter profile details updated in nectorr.' }
            sendMessageToServer(message, callback, res);
            return;

        } else {

            var message = { status: 'ERROR', message: 'There was an error in getting your twitter profile information.' };
            sendMessageToServer(message, callback, res);

        }
    });
}//var setTwitterProfileData = function (data, profileData) {

var setfbProfile = function (data, profileData, callback) {
    if (data.facebook.id != profileData.loginInfo.id) {
        data.facebook.name = profileData.loginInfo.name;
        data.facebook.id = profileData.loginInfo.id;
        data.save(function (err) {
            if (!err) {
                var message = { status: 'SUCCESS', message: 'Facebook profile details updated in nectorr.' }
                callback(message);
                return;
            } else {

                var message = { status: 'ERROR', message: 'Unable to update your facebook profile info.' };
                callback(message);
                console.log(err);
                return;

            } //if (!err) {

        }); //data.save(function (err) {
    } else {
        var message = { status: 'SUCCESS', message: 'All good on facebook. Proceed to setup.' }
        callback(message)
        return;

    }//if (data.facebook.id != profileData.fbLoginInfo.id) {

}

var saveLinkedInProfile = function (data, profileData) {
    var linkedInProfile = data.linkedin;
//    if (!linkedInProfile) {
        data.linkedin = profileData;
        data.save(function (err) {
            if (!err) {
                var message = { status: 'SUCCESS', message: 'linkedIn profile details updated on nectorr.' }
                sendMessageToServer(message, callback, res);
                return;
            } else {
                var message = { status: 'ERROR', message: 'Unable to update your linkedIn profile info.on nectorr.' };
                sendMessageToServer(message, callback, res);
                console.log(err);
                return;
            } //if (!err) {

        }); //data.save(function (err) {
//    } else {

//    }//if (!linkedInProfile) {
} //var saveLinkedInProfile= function(data, profileData){

var getBearer= function(callback) {
    var returnValue
    request.post(oauthOptions, function (e, r, body) {
        if (callback) {
            callback(body);
        } else {
            console.log("ERROR :" + e);
            console.log("R :" + r)


            console.log("BODY :" + body)
            
        }//        if (callback) {
        returnValue = body;
    });
    return returnValue;
}

var cleanClass = function (oldClass) {
    //var payload = oldClass;
    try {
        if (typeof oldClass != 'string') {
            payload = JSON.stringify(oldClass);
        } else {
            payload = oldClass;
        }

        payload = payload.replace(/\\"(<([^>]+)>)/ig, '');
        return JSON.parse(payload);
    } catch (ex) {
        return { error: { message: "Unable to parse class" }}
   }
}
module.exports = router;
