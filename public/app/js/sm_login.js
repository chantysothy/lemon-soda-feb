var nectorrFacebookId, nectorrTwitterId, nectorrGoogleId,nectorrInstgramId, nectorrLinkedInId
var fbUserLoggedIn = false;
var $smPermissionSet = { email: "", sm_name: "", neverAsk: false };
var loggedInUserId
var googleCallback
var googleScope = ['    '
    //, 
    //,
    //,', 
    //,
    //,
    //,
    //,
    //,'https://www.googleapis.com/auth/plus.media.upload'
    //,'https://www.googleapis.com/auth/paymentssandbox.make_payments'
    //,'https://www.googleapis.com/auth/userinfo.email'
];


$activeSocialMedia = null;
var $instagramUrls = {
    loginUrl: 'https://www.instagram.com/oauth/authorize/?client_id=f3a4940affd34bd7aaabebde1a685846&redirect_uri=http://localhost:1337/auth/callback/instagram&response_type=token'
    , clientId: 'f3a4940affd34bd7aaabebde1a685846'
    , callback: 'http://localhost:1337/auth/instagram/callback/'
}//var $instagramUrls{
var $twitterUrls = {
    'request_token_url': '//api.twitter.com/oauth/request_token'
    , 'access_token_url': 'https://api.twitter.com/oauth/access_token'
    , 'authenticate_url': 'https://api.twitter.com/oauth/authenticate'
    , 'authorize_url': 'https://api.twitter.com/oauth/authorize'
    , 'rest_base': 'https://api.twitter.com/1.1'
    , 'search_base': 'http://search.twitter.com'
    , 'stream_base': 'https://stream.twitter.com/1.1'
    , 'user_stream_base': 'https://userstream.twitter.com/1.1'
    , 'site_stream_base': 'https://sitestream.twitter.com/1.1'
    , 'lists'   : 'https://api.twitter.com/1.1/lists/list.json'//?screen_name=edwardvarghese
}
var appVersion = '1.90';
var twitterDefaults = {
    consumer_key: 'zR30W1z6cTQfYKaeMMrUdbXKm'
    , consumer_secret: 'W3k4tedpDKJ0hM6Hnn2I4hAHWag1INFw2ipaBOhgYBqt5zaxL2'
    , access_token_key: '103259010-14Fslxo1BpoGsEMCVKz41qxrj9aIRSRvzED9Q1an'
    , access_token_secret: 'l6YKbEkcAvFkCAiEBpbBT52GOfBuMcB6yAxyqPYxjzLBz'
    , headers: {
        'Accept': '*/*',
        'Connection': 'close',
        'User-Agent': 'localhost:1337/' + appVersion
    }
    , secure: false // force use of https for login/gatekeeper
};

var googlePlusDefaults = {
    clientId: '74079086779-p78eqegijmojsedbtl42f9ih9viu47ku.apps.googleusercontent.com'
    , clientSecret: 'PITf1zAhFCKSFlQBociujERc'
    , apiKey: 'AIzaSyCBed17n_6NdGO8PfHGYTByfKi0q-tmvaQ'
    , scopes: {
        plusMe: 'https://www.googleapis.com/auth/plus.me'
        , plusLogin: 'https://www.googleapis.com/auth/plus.login'
        , profilesRead: 'https://www.googleapis.com/auth/plus.profiles.read'
        , plusCirclesRead: 'https://www.googleapis.com/auth/plus.circles.read'
        , plusStreamRead: 'https://www.googleapis.com/auth/plus.stream.read'
        , plusStreamWrite: 'https://www.googleapis.com/auth/plus.stream.write'
        , plusCirclesWrite: 'https://www.googleapis.com/auth/plus.circles.write'
        , plusUserInfoProfile: 'https://www.googleapis.com/auth/userinfo.profile' 
    }
}

var facebookDefaults = {
    appId: '582000448664812'
    , appSecret: '9b089aff5785a8b74f64ed3530f3d6f6'
    , token: ''
    , scope: "email,public_profile,publish_actions, user_managed_groups, manage_pages, publish_pages, pages_show_list,publish_stream,user_photos, user_photo_video_tags, user_posts"
    
}

var initFacebookAPI = function () {
    window.fbAsyncInit = function () {
        version = 'v2.8'
        FB.init({
            appId: facebookDefaults.appId,  
            status: true,
            xfbml: true,
            cookie: true,
            version: 'v2.8' // use version 2.7

        });

    }
}//var initFacebook = function () {
var linkedInDefaults = {

} //var linkedInDefaults = {
var linkedInCallback;
var linkedInScope;
$nectorrLinkedInLogin = function (linkedInLoginScope, event, callback) {
    linkedInScope = linkedInLoginScope;
    linkedInCallback = callback;
    
    IN.Event.on(IN, "auth", getLinkedInUserDetails); 
    IN.User.authorize(function (data, metadata) {
            //save linkedin authorization

    });
    //getLinkedInUserDetails();
}//$nectorrLinkedInLogin = function (linkedInLoginScope, event, callback) {

$nectorrFacebookLogin = function (fbScope, event, callback) {
    FB.init({
        appId: facebookDefaults.appId,  // Change appId 409742669131720 with your Facebook Application ID
        status: true,
        xfbml: true,
        cookie: true,
        version: 'v2.8' // use version 2.7

    });

    if (fbScope) {
            FB.getLoginStatus(function (response) {
                if (response.status === 'connected') {
                    fbAccessToken = response.authResponse.accessToken;
                    callback(response);
                } else {
                    FB.login(function (response) {
                        if (response && !response.error) {
                            fbAccessToken = response.authResponse.accessToken;
                            //var accessToken = response.authResponse.accessToken;
                            nectorrFacebookId = response.authResponse.userID;
                            callback(response);

                            //extending facebook token from client side. Not to be used till  we are using server side extending of token
                            //if (fbAccessToken) {
                            //    //extending access token
                            //    var oAuthParams = {};
                            //    oAuthParams['client_id'] = facebookDefaults.appId;
                            //    oAuthParams['client_secret'] = facebookDefaults.appSecret;
                            //    oAuthParams['grant_type'] = 'fb_exchange_token';
                            //    oAuthParams['fb_exchange_token'] = 'accessToken';
                            //    oAuthParams['response_type'] = 'token';
                            //    FB.api('/oauth/access_token', 'post', oAuthParams, function (response) {
                            //        callback(response)
                            //    });//FB.api('/oauth/access_token', 'post', OauthParams, function (response) {
                            //    callback(response);
                            //} else {
                            //    alert("We are experiencing difficulties in extending your access token. Please try after sometime.");
                            //}
                        } else {
                            alert("There was an error in connecting with facebook. The  message nectorr recieved is : " + error)
                        }
                    }, fbScope);//FB.login(function () {
                }//if (response.status === 'connected') {
            });//FB.getLoginStatus(function (response) {
    }//if (scope) { 
}; //$facebookLogin = function (scope) {

(function (d, s, id) {
        var js, fjs = d.getElementsByTagName(s)[0];
        if (d.getElementById(id))
            return;
        js = d.createElement(s);
        js.id = id;
        js.src = "//connect.facebook.net/en_US/all.js";
        fjs.parentNode.insertBefore(js, fjs);
    }(document, 'script', 'facebook-jssdk'));

var $nectorrTwitterLogin = function (callback) {
    var command = $twitterUrls.authorize_url;
    $nectorrTwitterExecCommand(command, callback);
}//var $nectorrTwitterLogin 
$nectorrTwitterExecCommand = function(url,callback) {
    $.ajax({
        headers: { "Accept": "application/json" }
        , type: 'GET'
//        , url: twitterUrls.request_token_url
        , url: '/auth/twitter'
        , data: "email=" + $getClientEmail()
        , dataType: "jsonp"
        , jsonp: "callback"
        , crossDomain: true
        , beforeSend: function (xhr) {
            xhr.withCredentials = true;
            //xhr.setRequestHeader(JSON.stringify(twitterDefaults.headers));
        }
        , jsonPCallback: "jsonpCallback"
        , success: function (data) {
            if (callback)
                callback(data);
            
            //$("#feeds").children().show();
        }
        , error: function (jqXHR, textStatus, errorThrown) {
            alert("ERROR: " + textStatus + "DETAILS: " + errorThrown);
        }
    });

}//$twitterLogin = function() {
var setPostableLocs = function (newPostableLocs, sm_name, callback) {//'/user/get'
    $.ajax({
        headers: { "Accept": "application/json" }
        , type: 'POST'
        , url: '/postable-loc/set'
        , data: "email=" + $getClientEmail() + "&sm_name=" + sm_name + "&postLoc=" + JSON.stringify(newPostableLocs)
        , dataType: "jsonp"
        , jsonp: "callback"
        , crossDomain: true
        , beforeSend: function (xhr) {
            xhr.withCredentials = true;
        }
        , jsonPCallback: "jsonpCallback"
        , success: function (data) {
            if (callback) {
                callback(data);
            } //if (callback) { 
        }
        , error: function (jqXHR, textStatus, errorThrown) {
            alert("Unable to connect to nectorr. ERROR: " + textStatus + "DETAILS: " + JSON.stringify(errorThrown));
        }
    }); //$.ajax({
}//var setPostableLocs = function (newPostableLocs, sm_name, callback) {

var getLoggedInUserDetails = function (callback) {//'/user/get'
    if (loggedInUserId) {
        var message = { status: "SUCCESS", message: "User already logged in", data: { userId: loggedInUserId } }
        callback(message);
    } else {
        $.ajax({
            headers: { "Accept": "application/json" }
            , type: 'post'
            , url: '/user/get'
            , data: "email=" + $getClientEmail()
            , dataType: "jsonp"
            , jsonp: "callback"
            , crossDomain: true
            , beforeSend: function (xhr) {
                xhr.withCredentials = true;
            }
            , jsonPCallback: "jsonpCallback"
            , success: function (data) {
                loggedInUserId = data;
                if (callback) {
                    callback(data);
                } //if (callback) { 
            }
            , error: function (jqXHR, textStatus, errorThrown) {
                alert("Unable to connect to nectorr. ERROR: " + textStatus + "DETAILS: " + JSON.stringify(errorThrown));
            }
        }); //$.ajax({
    } //if (loggedInUserId) {
}//var getLoggedInUserDetails = function (callback) {
var $twitterLogin = function (callback) {
    if (callback) {
        $.ajax({
            headers: { "Accept": "application/json" }
            , type: 'GET'
            , url: '/auth/twitter'
            , data: "email=" + $getClientEmail()
            , dataType: "jsonp"
            , jsonp: "callback"
            , crossDomain: true
            , beforeSend: function (xhr) {
                xhr.withCredentials = true;
            }
            , jsonPCallback: "jsonpCallback"
            , success: function (data) {
                    if (callback) {
                        callback(data);
                    } //if (callback) { 
            }
            , error: function (jqXHR, textStatus, errorThrown) {
                alert("Unable to connect to nectorr. ERROR: " + textStatus + "DETAILS: " + eJSON.stringify(rrorThrown));
            }
        }); //$.ajax({

    } //if (callback) {
} //allback){

$initializeGoogleAuth2 = function () {
    initializeGoogle();
} // Google signIn

$initializeGooglewithCallback = function (callback) {
    var auth2, authInstance;
    initializeGoogle(true, callback); // default scope but get authResponse from google
} // Google signIn

var saveGoogleProfileData = function (profile) {
    var clientEmail = $getClientEmail();
    delete profile.etag;
    delete profile.kind;
    var loginProfile = { email: clientEmail, id: profile.id };
    var dataString = "googlePlusProfile=" + JSON.stringify(loginProfile);
    loginProfile = JSON.stringify(loginProfile);
    $.ajax({
        headers: { "Accept": "application/json" }
        , type: 'GET'
        , url: '/google/profile'
        , data: dataString
        ,dataType: "jsonp"
        , jsonp: "callback"
        , crossDomain: true
        , beforeSend: function (xhr) {
            xhr.withCredentials = true;
            xhr.setRequestHeader("Content-Length", dataString.length);
        }
        ,jsonPCallback: "jsonpCallback"
        , success: function (data) {
            manageServerResponse(data);
            //alert("SUCCESS+" + data);
            // set global variable and move to the next tab for setup
            // VerifyResultAndProcessForGooglePlus(data);
            // $("#feeds").children().show();
        }
        , error: function (jqXHR, textStatus, errorThrown) {
            //var msgBox = $('#butrfly-login').find();
            alert("ERROR: " + textStatus + "DETAILS: " + JSON.stringify(errorThrown));
        }
    });

} //var saveGoogleProfileData = function (profile) {
///twitter/get/lists
var $getTwitterLists = function (callback) {
    $.ajax({
        headers: { "Accept": "application/json" }
        , type: 'GET'
        , url: '/twitter/get/lists'
        , data: "email=" + $getClientEmail()
        , dataType: "jsonp"
        , jsonp: "callback"
        , crossDomain: true
        , beforeSend: function (xhr) {
            xhr.withCredentials = true;
        }
        , jsonPCallback: "jsonpCallback"
        , success: function (data) {
                if (callback) {
                    callback({ status : data.status, sm_name: "twitter", 'data': data.data});
                }
        }
        , error: function (jqXHR, textStatus, errorThrown) {
            //var msgBox = $('#butrfly-login').find();
            alert("ERROR: " + textStatus + "DETAILS: " + JSON.stringify(errorThrown));
        }
    }); //$.ajax({
}//var saveFacebookData = function (data) { 

var $saveLoginInfo = function (loginInfo, event, callback) {
    $.ajax({
        headers: { "Accept": "application/json" }
        , type: 'GET'
        , url: '/profile/save'
        , data: "smProfile=" + JSON.stringify(loginInfo)
        ,dataType: "jsonp"
        , jsonp: "callback"
        , crossDomain: true
        , beforeSend: function (xhr) {
            xhr.withCredentials = true;
        }
        ,jsonPCallback: "jsonpCallback"
        , success: function (data) {
            if (data.status == 'SUCCESS') {
                // set global variable and move to the next tab for setup
                //$showMessage(divId, msg, msgType, show);
                if (callback) { 
                    callback(data);
                }
            } else { 
            } //if (data.status == 'SUCCESS') { 
        }
        , error: function (jqXHR, textStatus, errorThrown) {
            //var msgBox = $('#butrfly-login').find();
            alert("ERROR: " + textStatus + "DETAILS: " + JSON.stringify(errorThrown));
        }
    }); //$.ajax({
}//var saveFacebookData = function (data) { 

var $getCredsFromServer = function (email, callback) {
    var value = { 'email': $getClientEmail() };
    var permsFromServer
    $.ajax({
        headers: { "Accept": "application/json" }
        , type: 'GET'
        , url: '/perms/get'
        ,data: "getPermsFor=" + JSON.stringify(value)
        ,dataType: "jsonp"
        , jsonp: "callback"
        , crossDomain: true
        , beforeSend: function (xhr) {
            xhr.withCredentials = true;
        }
        ,jsonPCallback: "jsonpCallback"
        , success: function (data) {
                if (callback) { 
                    callback(data);
                } //if (callback) { 
        }
        , error: function (jqXHR, textStatus, errorThrown) {
            alert("Unable to connect to nectorr. ERROR: " + textStatus + "DETAILS: " + JSON.stringify(errorThrown));
        }
    }); //$.ajax({

}//var getCredsFromServer = function (email) { 

var setPostableLoc = function (postableLoc, callback) {
    var queryParam = "email=" + $getClientEmail() + "&postableLocs=";
    var postableLocLength = JSON.stringify(postableLoc).length;
    var lengthOfParams = queryParam.length + postableLocLength
   
    if (callback) {
        $.ajax({
            headers: { "Accept": "application/json"}
            , type: 'GET'
            , url: '/postable-loc/set'
            , data: "email=" + $getClientEmail() + "&postableLocs=" + JSON.stringify(postableLoc)
            , dataType: "jsonp"
            , jsonp: "callback"
            , crossDomain: true
            , beforeSend: function (xhr) {
                xhr.withCredentials = true;
                //                xhr.setRequestHeader('content-length', queryParam.length + postableLocLength);
                //xhr.setRequestHeader('Content-Length', lengthOfParams.toString());
            }
            , jsonPCallback: "jsonpCallback"
            , success: function (data) {
                    if (callback) {
                        callback(data);
                    } //if (callback) { 
            }
            , error: function (jqXHR, textStatus, errorThrown) {
                alert("Unable to connect to nectorr. ERROR: " + textStatus + "DETAILS: " + JSON.stringify(errorThrown));
            }
        }); //$.ajax({
    } // if callback
}//var setPostableLocs = function (callback) {

var $setCredsToServer = function (creds, callback) {
    var value = creds.email;
    if (callback) {
        $.ajax({
            headers: { "Accept": "application/json" }
            , type: 'GET'
            , url: '/perms/set'
            ,data: "setPermsFor=" + JSON.stringify(creds)
            ,dataType: "jsonp"
            , jsonp: "callback"
            , crossDomain: true
            , beforeSend: function (xhr) {
                xhr.withCredentials = true;
            }
            ,jsonPCallback: "jsonpCallback"
            , success: function (data) {
                if (data.status == 'SUCCESS') {
                    if (callback) {
                        callback(data);
                    } //if (callback) { 
                } else {
                    alert(data.Message);
                } //if (data.status == 'SUCCESS') { 
            }
            , error: function (jqXHR, textStatus, errorThrown) {
                alert("Unable to connect to nectorr. ERROR: " + textStatus + "DETAILS: " + JSON.stringify(errorThrown));
            }
        }); //$.ajax({

    } //if (callback) { 
}//var setCredsToServer -function (email) {
 
var $executeFacebookCommand = function (scope, command, callback) {
    if (!scope) return;

    if (command){
        FB.init({
            appId: facebookDefaults.appId,  // Change appId 409742669131720 with your Facebook Application ID
            status: true,
            xfbml: true,
            cookie: true,
            version: 'v2.8' // use version 2.7

        });

        FB.getLoginStatus(function (response) {
            if (response.status === 'connected') {
                nectorrFacebookId = response.authResponse.userID;
                fbAccessToken = response.authResponse.accessToken;
                FB.api(command, function (res, err) {
                    if (!err) {
                        if (callback)
                            callback(res);
                    } else {
                        callback({ status: 'ERROR', message: JSON.stringify(err) });
                    }
                });//
            } else {
                FB.login(function () {
                    FB.api(command, function (res, err) {
                        var error = err;
                        var response = res;
                        if (!err) {
                            nectorrFacebookId = res.userID;
                            fbAccessToken = res.accessToken;
                            if (callback)
                                callback(res);
                        } else {
                            callback({ status: 'ERROR', message: JSON.stringify(err) });
                        }

                    }); //FB.api(cmd, function (res, err) {
                }, scope);//FB.login(function () {

            }
        });//FB.getLoginStatus(function (response) {
    } //if (command) {
}//var executeFacebookCommand = function (command, callback) {
var getFacebookPermsFromClient = function (e, callback) {
    var perms = 'manage_pages, user_managed_groups,pages_show_list';
    $nectorrFacebookLoginForGroups(perms, e, function (groupdata) {
        if (data) {
            var email = $getClientEmail();
            var cmd = "/me/accounts"; // command to get facebook user's pages and groups
            var userPages, userGroups;
            var permsData = { userId: email, 'sm_name': 'facebook', data: { type: 'groups_data', 'data': groupdata } };
            $setCredsToServer(permsData, function (permsStatus) {
                var retVal = permsStatus;
            });//$setCredsToServer(dbData, function (data) {  setting perms
            
            $executeFacebookCommand(cmd, function (data) {
                var fbReturnData = data;
                var dbData = { userId : email, 'sm_name' : 'facebook', data: { type: 'page_data', 'data': data } };
                // Build list for boosting profile
                //update boosting Profile to db
                $setCredsToServer(dbData, function (data) {
                    // update groups and pages info
                    $showMessage('showMessage', data, e, true);
                });//$setCredsToServer(dbData, function (data) { 
            }); //$executeFacebookCommand(cmd, function (data) {
            //update facebook access info
        } //if (data) { 
    });//$nectorrFacebookLogin('manage_pages, user_managed_groups', e, function (data) {


}
var getFacebookAccessToPagesAndGroups = function (ev) {
    if (getSocialMediaDetails.facebook) {
        $nectorrFacebookLogin(facebookDefaults.scope, e, function (data) {
            saveFacebookLoginInfo(data, ev, function (data) {
                if (data.status == 'SUCCESS') { 
                                //show message
                                //get list of pages
                                // get list of groups
                } //if (data.status == 'SUCCESS') { 
            });//saveFacebookLoginInfo(data, e, function (data) { 

        });
    } else { 

    } //if (getSocialMediaDetails.facebook) {

}//var getFacebookAccessToPagesAndGroups = function () {

var $getInstagramLogin = function (callback) {
    $.ajax({
        headers: { "Accept": "application/json" }
        , type: 'GET'
        //        , url: twitterUrls.request_token_url
        , url: 'https://api.instagram.com/oauth/authorize/'
        , data: { response_type: 'token', redirect_uri: $instagramUrls.callback, client_id: $instagramUrls.clientId }
        , dataType: "jsonp"
        , jsonp: "callback"
        , crossDomain: true
        , beforeSend: function (xhr) {
            xhr.withCredentials = true;
            //xhr.setRequestHeader(JSON.stringify(twitterDefaults.headers));
        }
        , jsonPCallback: "jsonpCallback"
        , success: function (data) {
            if (callback)
                callback(data);

            //$("#feeds").children().show();
        }
        , error: function (jqXHR, textStatus, errorThrown) {
            alert("ERROR: " + textStatus + "DETAILS: " + JSON.stringify(errorThrown));
        }
    });

}
/*
* @param callback
*/
var getQueryTags = function (callback) {
    $.ajax({
        headers: { "Accept": "application/json" }
        , type: 'GET'
        //        , url: twitterUrls.request_token_url
        , url: '/user-config/get'
        , data: "email=" + $getClientEmail()
        , dataType: "jsonp"
        , jsonp: "callback"
        , crossDomain: true
        , beforeSend: function (xhr) {
            xhr.withCredentials = true;
            //xhr.setRequestHeader(JSON.stringify(twitterDefaults.headers));
        }
        , jsonPCallback: "jsonpCallback"
        , success: function (data) {
            if (callback)
                callback(data);

            //$("#feeds").children().show();
        }
        , error: function (jqXHR, textStatus, errorThrown) {
            alert("ERROR: " + textStatus + "DETAILS: " + JSON.stringify(errorThrown));
        }
    });

}//var getConfiguration = function (callback) {
var pushArray = function (pushTo, getFrom) {
    for (var counter = 0; counter < getFrom.length; counter++) {
        if (getFrom[counter] != "")
            pushTo.push(getFrom[counter]);
    }//for (counter = 0; counter < getFrom.length; counter++) {
}

var googleUserScope = googlePlusDefaults.scopes.plusMe;//+ " " +
var googleCircleScope = googlePlusDefaults.scopes.plusCirclesRead + " " + googlePlusDefaults.scopes.plusCirclesWrite;//googlePlusDefaults.scopes.plusMe,
var initializeGoogle = function (getAuthResponse = false, callback, scope) {
    var auth2, authInstance;
    if (!nvCookie) {
        gapi.load('auth2', function () {
            //plusDomains.Circles.List
            auth2 = gapi.auth2.init({
                client_id: googlePlusDefaults.clientId
                , fetch_basic_profile: false
                , scope: (!scope) ? googleUserScope : scope
            }).then(function () {
                gapi.load('client', function () {

                    gapi.client.init({
                        apiKey: googlePlusDefaults.apiKey
                        , clientId: googlePlusDefaults.clientId
                        , scope: (!scope) ? googleUserScope : scope
                    })

                    gapi.client.load('plus', 'v1', function () {
                        authInstance = gapi.auth2.getAuthInstance();
                        if (!authInstance.isSignedIn.get()) {
                            authInstance.signIn();
                        } else if (authInstance.isSignedIn.get()) {
                            
                            authInstance = gapi.auth2.getAuthInstance();
                                var request = gapi.client.plus.people.get({
                                    'userId': 'me'
                                });
                                request.execute(function (resp) {
                                    console.log('Retrieved profile for:' + resp.displayName);
                                    if (!resp.error) {
                                        var returnValue
                                        if (getAuthResponse) {
                                            returnValue = authInstance;
                                        } else {
                                            returnValue = resp;
                                        }

                                        if (callback) {

                                            callback(returnValue);
                                        } else {
                                            saveGoogleProfileData(resp);
                                        }
                                        // save cookie
                                        //userLoginTo
                                    } else {
                                        //error

                                        callback({status : "ERROR", message : "Unable to connect with Google+ at the moment."});
                                    }
                            //    });
                            });
                        }
                    });

                });
            });
                //authInstance.signIn();
        });
    } else {
        //userLoginTo = set to Google
    }
}//var initializeGoogle = function (callback) {

var getGoogleCircles = function (callback, loggedInUserId,getAuthResponse = "") {
    var auth2, authInstance;
    // assumes that auth2 & gapi.client is initiated and loaded
    if (!gapi.auth2) {
        initGapi(function (data) {
            getGapiInfo(callback);
        });
    } else {
        getGapiInfo(callback);
    }

}//var getGoogleCircles = function (callback
var getLinkedInUserDetails = function () {
    //,"group-memberships:(group:(id,name),membership-state)
    IN.API.Profile("me")
        .fields("firstName", "lastName", "industry", "location:(name)", "picture-url", "headline", "num-connections", "public-profile-url", "email-address", "date-of-birth")
        .result(linkedInCallback)
        .error(linkedInCallback);
}

var saveLinkedInUserDetails = function (data) {
    var a = data;
}

var writeFacebookTextPost = function (text) { 

} //var writeFacebookTextPost = function (text) { 

var writeFacebookUrlPosts = function (url, imgUrl) { 

} //var writeFacebookUrlPosts = function (url, imgUrl) { 

var writeTwitterTextPost = function (text) { 

}//var writeTwitterTextPost = function (text) { 

var writeTwitterImagePost = function (imagePath) { 

}//var writeTwitterImagePost =function (imagePath) { 

var writeTwitterUrlPost = function (url) { 

}//var writeTwitterUrlPost = function (url) { 

var writeGoogleTextPostInCircles = function (text) { 

}//var writeGoogleTextPostInCircles = function (text) { 

var writeGoogleImagePostInCircles = function (imagePath) { 

}//var writeGoogleImagePostInCircles = function (imagePath) { 

var writeGoogleUrlPostsInCircles = function (url) { 

}//var writeGoogleUrlPostsInCircles = function (url) { 

var WriteLinkedInTextPost = function (text) { 

}//var WriteLinkedInTextPost = function (text) { 
var writeLinkedInUrlPosts = function (url) { 

}//var writeLinkedInUrlPosts = function (url) { 

var writeLinkedInImagePosts = function (imageUrl) { 

}//var writeLinkedInImagePosts = function (imageUrl) { 

var WriteLinkedInTextPostInGroups = function (text) { 

}//var WriteLinkedInTextPost = function (text) { 
var writeLinkedInUrlPostsInGroups = function (url) { 

}//var writeLinkedInUrlPosts = function (url) { 

var writeLinkedInImagePostsInGroups = function (imageUrl) { 

}//var writeLinkedInImagePosts = function (imageUrl) { 

var getTwitterLists = function (callback) { 
}//var getTwitterLists = function (callback) { 

var getLinkedInGroups = function (callback) { 

}//var getLinkedInGroups = function (callback) { 

var getFacebookGroups = function (callback) { 

} //var getFacebookGroups = function (callback) { 

var getSocialFeeds = function(callback) {
    if (callback) {
        var feedsDivParent = $('#iFrameSettings', parent.document);
        var feedsDiv = feedsDivParent.context.getElementById('feeds');
        if (feedsDiv) {
            getLoginObject(function (data) {

                setPublishCredentials(data, function (publishCreds) {
                    feedsDiv.socialfeed(publishCredentials);
                    callback({status: 'SUCCES'});
                });
            });

        }
    }//if (callback) {

}//var getSocialFeeds = function(callback) {


var getLoginObject = function (callback) {
    $.ajax({
        headers: { "Accept": "application/json" }
        , type: 'GET'
        , url: '/login/details'
        , data: "login_details=" + JSON.stringify({ user_name: $getClientEmail() })
        , dataType: "jsonp"
        , jsonp: "callback"
        , crossDomain: true
        , beforeSend: function (xhr) {
            xhr.withCredentials = true;
        }
        , jsonPCallback: "jsonpCallback"
        , success: function (data) {
            if (data.status == 'SUCCESS') {
                if (callback) {
                    callback(data.data);
                }
            } //if (data.status == 'SUCCESS') {
        }
        , error: function (jqXHR, textStatus, errorThrown) {
            alert("ERROR: " + textStatus + "DETAILS: " + JSON.stringify(errorThrown));
        }
    });

}//var getLoginObject = function (invitationCode) {

var setLoginDetails = function (userObject, callback) {
    if (callback) {
        var email = $getClientEmail(), userDetails = JSON.stringify(userObject);
        $.ajax({
            headers: { "Accept": "application/json" }
            , type: 'get'
            //        , url: twitterUrls.request_token_url
            , url: '/login/change-password'
            , data: "email=" + email + "&password=" + userObject.local.password
            , dataType: "jsonp"
            , jsonp: "callback"
            , crossDomain: true
            , beforeSend: function (xhr) {
                xhr.withCredentials = true;
                //xhr.setRequestHeader(JSON.stringify(twitterDefaults.headers));
            }
            , jsonPCallback: "jsonpCallback"
            , success: function (data) {
                if (callback)
                    callback(data);

                //$("#feeds").children().show();
            }
            , error: function (jqXHR, textStatus, errorThrown) {
                alert("ERROR: " + textStatus + "DETAILS: " + JSON.stringify(errorThrown));
            }
        });

    }//if (callback) {
};

var setPublishCredentials = function (userObject,  callback) {
    var smName = ["facebook", "twitter", "instagram", "youtube", "dribbble", "blogger"];

    //for (var counter = 0; counter < smName.length; counter++) {
    //    if (userObject[smName[counter]]) {
    //        publishCredentials[smName[counter]].accounts.push(userObject[smName[counter]].username);
    //    }//if (userObject[smName[counter]]) {
    //}//for (var counter = 0; counter < smName.length; counter++) {
    var queryTags = [];
    getQueryTags(function (queryObject) {
        if (queryObject.StreamObject.ListenTo) {
            var listenTo = queryObject.StreamObject.ListenTo.split(',');
            if (listenTo) {
                pushArray(queryTags,listenTo);
            }
        }//if (queryTags.Listento) {
        if (queryObject.StreamObject.Trending) {
            var trending = queryObject.StreamObject.Trending.split(',');
            if (trending) {
                pushArray(queryTags, trending);
            }
        }

        if (queryObject.StreamObject.Engagement) {
            var engagement = queryObject.StreamObject.Engagement.split(',');
            if (engagement) {
                pushArray(queryTags, engagement);
                //queryTags.push(engagement);
            }
        }

        if (queryObject.StreamObject.Monitor) {
            var monitor = queryObject.StreamObject.Monitor.split(',');
            if (monitor) {
                pushArray(queryTags, monitor);
                //queryTags.push(monitor);
            }
        }

        //$nectorrFacebookLogin1('user_posts,read_insights,read_audience_network_insights', null, function (data) {
        //    publishCredentials.facebook.access_token = data.authResponse.accessToken;
        //    publishCredentials.twitter.consumer_key = authCreds.twitter.consumer_key;
        //    publishCredentials.twitter.consumer_secret = authCreds.twitter.consumer_secret;
        //    publishCredentials.instagram.client_id = authCreds.instagram.client_id;
        //    publishCredentials.pinterest.client_id = authCreds.pinterest.client_id;
        //    publishCredentials.google.client_id = authCreds.google.client_id;
        //    publishCredentials.facebook.accounts = queryTags;
        //    publishCredentials.google.accounts = queryTags;
        //    publishCredentials.twitter.accounts = queryTags;
        //    publishCredentials.instagram.accounts = queryTags;
        //    publishCredentials.delicious.accounts = queryTags;
        //    publishCredentials.blogger.accounts = queryTags;
        //    publishCredentials.dribbble.accounts = queryTags; 
        //    publishCredentials.youtube.accounts = queryTags;
        //    if (callback)
        //        callback(publishCredentials);
        //});//$nectorrFacebookLogin1(function (data) {
    });//getQueryTags(function (queryObject) {
}//var setPublishCredentials = function (publishCreds) {
//
var getRequest = function (url, callback) {
    return $.get(url, callback, 'json');
}

var initGapi = function () {
    var auth2;
    gapi.load('auth2', function () {
        //plusDomains.Circles.List
        auth2 = gapi.auth2.init({
            client_id: googlePlusDefaults.clientId
            , fetch_basic_profile: false
            , scope: googleUserScope
        }).then(function () {
            gapi.load('client', function () {

                gapi.client.init({
                    apiKey: googlePlusDefaults.apiKey
                    , clientId: googlePlusDefaults.clientId
                    , scope: googleUserScope
                })//gapi.client.init({
            })//gapi.load('client', function () {
        });//}).then(function () {
    });//gapi.load('auth2', function () {
}//var initGapi = function () 

var getGapiInfo = function (callback) {
    auth2 = gapi.auth2.getAuthInstance()
        .then(function () {
            gapi.load('client:auth2', function () {

                gapi.client.init({
                    apiKey: googlePlusDefaults.apiKey
                    , clientId: googlePlusDefaults.clientId
                    , scope: googleCircleScope
                })

                gapi.client.load('plus', 'v1', function () {
                    authInstance = gapi.auth2.getAuthInstance();
                    if (!authInstance.isSignedIn.get()) {
                        authInstance.signIn();
                    } else if (authInstance.isSignedIn.get()) {

                        authInstance = gapi.auth2.getAuthInstance();
                        if (callback) {
                            if (getAuthResponse != "") {
                                getAuthResponse = getAuthResponse.replace('userId', loggedInUserId);
                                var circleResponse = gapi.client.request({
                                    'path': getAuthResponse
                                })
                                circleResponse.execute(function (circleResponse) {
                                    console.log('Retrieved circles for:' + resp.displayName + ":-- " + JSON.stringify(circleResponse)); callback(circleResponse);
                                    callback(circleResponse);
                                });
                            } else {
                                //                         callback(resp);
                            } //if (getAuthResponse != "") {
                        }//if callback
                    }// else if
                });
                //            });
                //authInstance.signIn();
            });
        });// then
    //});//gapi.load('auth2', 

}
var getVignetteFromDb = function (callback) {
    $.ajax({
        headers: { "Accept": "application/json" }
        , type: 'get'
        , url: '/vignette/get'
        , data: "email=" + $getClientEmail() //+ "&vignetteInfo=" + JSON.stringify(vignetteData) + "&vignette_name=" + vignetteName
        , dataType: "jsonp"
        , jsonp: "callback"
        , crossDomain: true
        , beforeSend: function (xhr) {
            xhr.withCredentials = true;
        }
        , jsonPCallback: "jsonpCallback"
        , success: function (data) {
            if (callback) {
                callback(data);
            } //if (callback) { 
        }
        , error: function (jqXHR, textStatus, errorThrown) {
            alert("Unable to connect to nectorr. ERROR: " + textStatus + "DETAILS: " + JSON.stringify(errorThrown));
        }
    }); //$.ajax({
}//var getLoggedInUserDetails = function (callback) {

var postUsingVignette = function (vignetteInfo,callback) {
    $.ajax({
        headers: { "Accept": "application/json" }
        , type: 'post'
        , url: '/send/post/vignette'
        , data: "email=" + $getClientEmail() + "&dataToPost=" + JSON.stringify(vignetteInfo.dataToPost) + "&vignettes=" + JSON.stringify(vignetteInfo.vignettes) + "&timelines=" + JSON.stringify(vignetteInfo.timelines)//+ "&vignetteInfo=" + JSON.stringify(vignetteData) + "&vignette_name=" + vignetteName
        , dataType: "jsonp"
        , jsonp: "callback"
        , crossDomain: true
        , beforeSend: function (xhr) {
            xhr.withCredentials = true;
        }
        , jsonPCallback: "jsonpCallback"
        , success: function (data) {
            if (callback) {
                callback(data);
            } //if (callback) { 
        }
        , error: function (jqXHR, textStatus, errorThrown) {
            alert("Unable to connect to nectorr. ERROR: " + textStatus + "DETAILS: " + JSON.stringify(errorThrown));
        }
    }); //$.ajax({
}//var getLoggedInUserDetails = function (callback) {

var saveVignetteToDB = function (vignetteName, vignetteData, callback) {
    $.ajax({
        headers: { "Accept": "application/json" }
        , type: 'post'
        , url: '/vignette/set'
        , data: "email=" + $getClientEmail() + "&vignetteInfo=" + JSON.stringify(vignetteData) + "&vignette_name=" + vignetteName
            , dataType: "jsonp"
            , jsonp: "callback"
            , crossDomain: true
            , beforeSend: function (xhr) {
                xhr.withCredentials = true;
            }
            , jsonPCallback: "jsonpCallback"
            , success: function (data) {
                if (callback) {
                    callback(data);
                } //if (callback) { 
            }
            , error: function (jqXHR, textStatus, errorThrown) {
                alert("Unable to connect to nectorr. ERROR: " + textStatus + "DETAILS: " + JSON.stringify(errorThrown));
            }
        }); //$.ajax({
}//var getLoggedInUserDetails = function (callback) {

var boostNow = function (dataToPost, callback) {
    $.ajax({
        headers: { "Accept": "application/json" }
        , type: 'get'
        , url: '/send/post/now'
        , data: "email=" + $getClientEmail() + "&dataToPost=" + JSON.stringify(dataToPost)
        , dataType: "jsonp"
        , jsonp: "callback"
        , crossDomain: true
        , beforeSend: function (xhr) {
            xhr.withCredentials = true;
            xhr.setRequestHeader('Access-Control-Allow-Origin', '*');
            xhr.setRequestHeader('Access-Control-Allow-Methods', 'POST');
            xhr.setRequestHeader('Access-Control-Max-Age', '50000');
        }
        , jsonPCallback: "jsonpCallback"
        , success: function (data) {
            if (callback) {
                callback(data);
            } //if (callback) { 
        }
        , error: function (jqXHR, textStatus, errorThrown) {
            alert("Unable to connect to nectorr. ERROR: " + textStatus + "DETAILS: " + JSON.stringify(errorThrown));
        }
    }); //$.ajax({
}//var getLoggedInUserDetails = function (callback) {
var getGoogleConnections = function (userId,callback) {
    if (userId) {
        initializeGoogleToGetGapi(true, function (googleResponse) {
            if (googleResponse) {
                var gapi = googleResponse.gapi;
                gapi.client.people.people.connections.list({
                    'resourceName': 'people/' + userId,
                    'pageSize': 10,
                }).then(function (response) {
                    var connections = response.result.connections;
                    if (callback) {
                        callback(connections)
                    }
                });

            } else {

            }
        }, googlePlusDefaults.scopes.plusCirclesRead);//initializeGoogle(true
    }//if (userId) {
}//var getGoogleCircles = function (userId) {
var initializeGoogleToGetGapi = function (getAuthResponse = false, callback, scope) {
    var auth2, authInstance;
    if (!nvCookie) {
        gapi.load('auth2', function () {
            //plusDomains.Circles.List
            auth2 = gapi.auth2.init({
                client_id: googlePlusDefaults.clientId
                , fetch_basic_profile: false
                , scope: (!scope) ? googleUserScope : scope
            }).then(function () {
                gapi.load('client', function () {

                    gapi.client.init({
                        apiKey: googlePlusDefaults.apiKey
                        , clientId: googlePlusDefaults.clientId
                        , scope: (!scope) ? googleUserScope : scope
                    })

                    gapi.client.load('plus', 'v1', function () {
                        authInstance = gapi.auth2.getAuthInstance();
                        if (!authInstance.isSignedIn.get()) {
                            authInstance.signIn();
                        } else if (authInstance.isSignedIn.get()) {

                            authInstance = gapi.auth2.getAuthInstance();
                            var request = gapi.client.plus.people.get({
                                'userId': 'me'
                            });
                            request.execute(function (resp) {
                                console.log('Retrieved profile for:' + resp.displayName);
                                if (!resp.error) {
                                    var returnValue
                                    if (getAuthResponse) {
                                        returnValue = authInstance;
                                    } else {
                                        returnValue = resp;
                                    }

                                    if (callback) {

                                        callback({ profile: returnValue, "gapi": gapi });
                                    } else {
                                        saveGoogleProfileData(resp);
                                    }
                                    // save cookie
                                    //userLoginTo
                                } else {
                                    //error

                                    callback({ status: "ERROR", message: "Unable to connect with Google+ at the moment." });
                                }
                                //    });
                            });
                        }
                    });

                });
            });
            //authInstance.signIn();
        });
    } else {
        //userLoginTo = set to Google
    }
}//var initializeGoogleToGetGapi = function (callback) {
