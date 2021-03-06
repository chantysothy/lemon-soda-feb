﻿var loginObject;
$(window).load(function () {
    var googleAuthObject, facebookAuthObject, twitterAuthObject, instagramAuthObject, pinterestAuthObject, bloggerAuthObject, loggedInUserInfo;
    if (!$isLoggedIn()) {
        $('#invite').hide(); 
        $('#logout').hide();   
        window.location.href = '../';
    } else {
        $('#invite').show();
        $('#logout').show();

        getQueryTags(function (searchOptions) {
            if (searchOptions && searchOptions.status == "SUCCESS") {
                getLoggedInUserDetails(function (userData) {
                    //                var data = JSON.parse(userData)
                    var data = userData;
                    if (data.status == "SUCCESS") {
                        loggedInUserInfo = data;
                        var publishCredentials = {
                            // FACEBOOK
                            facebook: {
                                accounts: [loggedInUserInfo.data.facebook.profileInfo.userID, markHashTags(searchOptions.StreamObject.ListenTo), markHashTags(searchOptions.StreamObject.Engagement), markHashTags(searchOptions.StreamObject.Traffic), markHashTags(searchOptions.StreamObject.Trending), markHashTags(searchOptions.StreamObject.Trending)],
                                limit: 2,
                                access_token: '150849908413827|a20e87978f1ac491a0c4a721c961b68c'
                            },
                            // Twitter
                            twitter: {
                                accounts: ['@' + loggedInUserInfo.data.twitter.profileInfo.screen_name, markHashTags(searchOptions.StreamObject.ListenTo), markHashTags(searchOptions.StreamObject.Engagement), markHashTags(searchOptions.StreamObject.Traffic), markHashTags(searchOptions.StreamObject.Trending), markHashTags(searchOptions.StreamObject.Trending)],
                                limit: 2,
                                consumer_key: 'zR30W1z6cTQfYKaeMMrUdbXKm', // make sure to have your app read-only
                                consumer_secret: 'W3k4tedpDKJ0hM6Hnn2I4hAHWag1INFw2ipaBOhgYBqt5zaxL2', // make sure to have your app read-only
                            },
                            // INSTAGRAM
                            instagram: {
                                accounts: ['@extendmore', markHashTags(searchOptions.StreamObject.ListenTo), markHashTags(searchOptions.StreamObject.Engagement), markHashTags(searchOptions.StreamObject.Traffic), markHashTags(searchOptions.StreamObject.Trending), markHashTags(searchOptions.StreamObject.Trending)],
                                limit: 2,
                                client_id: 'f3a4940affd34bd7aaabebde1a685846'
                            },
                            //pinterest
                            pinterest: {
                                accounts: ['#startup', '#fund'],
                                limit: 2,
                                client_id: '2c6d2173ae9d41de905236e6301e5a43'
                            },
                            google: {
                                accounts: [markHashTags(searchOptions.StreamObject.ListenTo), markHashTags(searchOptions.StreamObject.Engagement), markHashTags(searchOptions.StreamObject.Traffic), markHashTags(searchOptions.StreamObject.Trending), markHashTags(searchOptions.StreamObject.Trending)],
                                limit: 2,
                                client_id: '379200ff63bf29beae9389865d135510baa583dabae4846e4b9ef02fdb308d43',
                            },
                            dribbble: {
                                accounts: [],
                                limit: 2,
                                client_id: '379200ff63bf29beae9389865d135510baa583dabae4846e4b9ef02fdb308d43',
                                client_secret: '808631ddf785ea499bf84d88752c3887f3e8375bf68c5632875f8bcbcf4c632d',
                                client_access_token: '5c2cdbd6a66f269266e343bb1dccb669b529d8ef15faadd4c1d7a32843f59877'
                            },
                            youtube: {
                                accounts: [],
                                limit: 2,
                                client_id: '690502963259-bavfo91mdkhre73s8pej1rv88lfm26mc.apps.googleusercontent.com',
                                client_secret: 'efHtD69bKTpjqJWHF6Y_ZejY'
                            },
                            tumblr: {
                                accounts: [],
                                limit: 2,
                                client_id: '2c6d2173ae9d41de905236e6301e5a43'
                            },
                            blogger: {
                                accounts: [],
                                limit: 2,
                                client_id: '2c6d2173ae9d41de905236e6301e5a43'
                            },
                            delicious: {
                                accounts: [],
                                limit: 2,
                                client_id: '2c6d2173ae9d41de905236e6301e5a43'
                            },

                            // GENERAL SETTINGS
                            length: 200,
                            show_media: true,
                            // Moderation function - if returns false, template will have class hidden
                            moderation: function (content) {
                                return (content.text) ? content.text.indexOf('fuck') == -1 : true;
                            },
                            update_period: 10 * 1000,
                            // When all the posts are collected and displayed - this function is evoked
                            callback: function () {
                                console.log('all posts collected');
                            },
                            template_html: '../template.html'
                            //update_period : 300
                        }
                        $nectorrFacebookLogin(facebookDefaults.scope, null, function (response) {
                            var facebookToken
                            if (response && response.authResponse.expiresIn < 10000) {
                                //accessCredsForBooster['facebook'] = response;
                                extendFBAccessToken(response.authResponse.accessToken, function (extendedTokenResponse) {
                                    //                                publishCredentials.facebook.access_token = extendedTokenResponse.authResponse.accessToken;
                                    (extendedTokenResponse && !extendedTokenResponse.error) ?
                                        //accessCredsForBooster['facebook'] = extendedTokenResponse;
                                        publishCredentials.facebook.access_token = extendedTokenResponse.authResponse.accessToken
                                        :
                                        publishCredentials.facebook.access_token = response.authResponse.accessToken;


                                });
                            }
                            publishCredentials.facebook.access_token = response.authResponse.accessToken;
                            facebookAuthObject = response;
                            var instagramAuthUrl = "https://api.instagram.com/oauth/authorize/?client_id=" + "f3a4940affd34bd7aaabebde1a685846" + "&response_type=code"
                            var feedDiv = $('#socialfeeds');
                            //saveFacebookInfo
                            $initializeGooglewithCallback(function (googleResponse) {
                                googleAuthObject = googleResponse.currentUser.get().getAuthResponse();//getAuthResponse();
                                var googleUser = googleResponse.currentUser.get().getId();
                                //accessCredsForBooster['google'] = response;                                        
                                var socialFeedLoginInfo = {
                                    // INSTAGRAM
                                    facebook: {
                                        accounts: ['@' + facebookAuthObject.authResponse.userID, markHashTags(searchOptions.StreamObject.ListenTo), markHashTags(searchOptions.StreamObject.Engagement), markHashTags(searchOptions.StreamObject.Traffic), markHashTags(searchOptions.StreamObject.Trending), markHashTags(searchOptions.StreamObject.Trending)],  //Array: Specify a list of accounts from which to pull posts
                                        limit: 5,                                    //Integer: max number of posts to load
                                        client_id: 'wj888T3jlauiQIjcdu751AELB', // make sure to have your app read-only
                                        access_token: facebookAuthObject.authResponse.accessToken, // make sure to have your app read-only
                                    },
                                    twitter: {
                                        accounts: ['@' + loggedInUserInfo.data.twitter.screen_name, markHashTags(searchOptions.StreamObject.ListenTo), markHashTags(searchOptions.StreamObject.Engagement), markHashTags(searchOptions.StreamObject.Traffic), markHashTags(searchOptions.StreamObject.Trending), markHashTags(searchOptions.StreamObject.Trending)],  //Array: Specify a list of accounts from which to pull posts
                                        limit: 5,                                    //Integer: max number of posts to load
                                        consumer_key: 'zR30W1z6cTQfYKaeMMrUdbXKm', // make sure to have your app read-only
                                        consumer_secret: 'W3k4tedpDKJ0hM6Hnn2I4hAHWag1INFw2ipaBOhgYBqt5zaxL2', // make sure to have your app read-only
                                    },
                                    google: {
                                        accounts: ['@' + googleUser, markHashTags(searchOptions.StreamObject.ListenTo), markHashTags(searchOptions.StreamObject.Engagement), markHashTags(searchOptions.StreamObject.Traffic), markHashTags(searchOptions.StreamObject.Trending), markHashTags(searchOptions.StreamObject.Trending)],  //Array: Specify a list of accounts from which to pull posts
                                        limit: 5,                                    //Integer: max number of posts to load
                                        client_id: googlePlusDefaults.clientId,       //String: Instagram client id (optional if using access token)
                                        access_token: googlePlusDefaults.apiKey,

                                        // GENERAL SETTINGS
                                        length: 400,                                      //Integer: For posts with text longer than this length, show an ellipsis.
                                    },
                                    blogger: {
                                        accounts: ['@' + googleUser],  //Array: Specify a list of accounts from which to pull posts
                                        limit: 5,                                    //Integer: max number of posts to load
                                        client_id: googlePlusDefaults.clientId,       //String: Instagram client id (optional if using access token)
                                        access_token: googlePlusDefaults.apiKey,

                                        // GENERAL SETTINGS
                                        length: 400,                                      //Integer: For posts with text longer than this length, show an ellipsis.
                                    },
                                    update_period: 5000,
                                    show_media: true

                                } //var socialFeedLoginInfo = {
                                if (searchOptions.StreamObject) {
                                    var searchDetails = ['Monitor', 'ListenTo', 'Engagement', 'Trending', 'ListenTo'];
                                    for (var searchDetailsCounter = 0; searchDetailsCounter < searchDetails.length; searchDetailsCounter++) {
                                        if (searchOptions.StreamObject[searchDetails[searchDetailsCounter]]) {
                                            var searchData = searchOptions.StreamObject[searchDetails[searchDetailsCounter]].split(',');
                                            pushArray(socialFeedLoginInfo.facebook.accounts, searchData);
                                            pushArray(socialFeedLoginInfo.twitter.accounts, searchData);
                                            pushArray(socialFeedLoginInfo.google.accounts, searchData);
                                        }//if (StreamObject[searchDetails[searchDetailsCounter]]) {
                                    }//for (var searchDetailsCounter = 0; searchDetailsCounter < searchDetails.length; searchDetailsCounter++) {
                                    feedDiv.socialfeed(socialFeedLoginInfo);
                                }
                            });

                        });
                    } else {
                        var message = { status: "ERROR", message: "There was an error connecting with Facebook. Do try again after a few minutes." }
                        $showMessage('serverResponse', message.message, message.status.toLowerCase(), true);

                    }
                });//fbconnect
            }//if (searchOptions && searchOptions.status == "SUCCESS"){
        });//getQueryTags(function (searchOptions) {
        //alert("social feed executed");

    }

}); //$(window).load(function () {
$(document).ready(function () {
    if (!$isLoggedIn()) {
        $('#invite').hide();
        $('#logout').hide();
        window.location.href = '../';
    } else {
        getLoginObject(function (loginObj) {
            loginObject = loginObj;
        });
        window.fbAsyncInit = function () {
            //version = 'v2.9'
            FB.init({
                appId: facebookDefaults.appId,
                status: true,
                xfbml: true,
                cookie: true,
                version: 'v2.9' // use version 2.7

            });
        }//window.fbAsyncInit = function () {

        //initFacebookAPI();
        var googleProfile, resourceName;
        //setCookie();    
        var linkedInProfile = {
            key: String
            , currentShare: Object
            , distance: Number
            , emailAddress: String
            , firstName: String
            , headline: String
            , industry: String
            , lastName: String
            , location: Object
            , numConnections: Number
            , pictureUrl: String
            , positions: Object
            , publicProfileUrl: String
            , summary: String
        }
        $("#tab2").click(function (e) {
            //src="../configure/index.html"
            //setTimeout(setIframeSrc("#iFrameSettings", "../configure/index.html"), 5);
            var src = $("#iFrameSettings").attr('src');
            if (!src) {
                setTimeout(setIframeSrc("#iFrameSettings", "../configure/index.html"), 5);
            }
        });
        $("#tab3").click(function (e) {
            //src="../configure/index.html"
            var src = $("#iFrameAnalytics").attr('src');
            if (!src) {
                setTimeout(setIframeSrc("#iFrameAnalytics", "../analytics/show/index.html"), 5);
                //$("#iFrameAnalytics").attr('src', "../analytics/show/index.html");
            }
        });
        $("#tab4").click(function (e) {
            //src="../configure/index.html"
            var src = $("#iFrameDashboard").attr('src');
            if (!src) {
                setTimeout(setIframeSrc("#iFrameDashboard", "../dashboard/index.html"), 5);
                //$("#iFrameDashboard").attr('src', "../dashboard/index.html");

            }
        });
        $("#tab5").click(function (e) {
            //src="../configure/index.html"
            var src = $("#iFrameBooster").attr('src');
            if (!src) {
                setTimeout(setIframeSrc("#iFrameBooster", "../booster/index.html"), 5);
                //$("#iFrameBooster").attr('src', "../booster/index.html") ;
            }
        });

        $("#icon_instagram").click(function (e) {
            var instagramAccessDetails;
            $getInstagramLogin(function (data) {
                instagramAccessDetails = data;
            });//$getInstagramLogin(function (data) 
        });
        $('#icon_twitter').click(function (e) {
            e.preventDefault();
            $nectorrTwitterLogin(function (twitterObject) {
                var a = twitterObject;
                $saveLoginInfo('twitter', twitterObject.profileInfo, null, function (nectorrResponse) {
                });
            });//$nectorrTwitterLogin(function (twitterObject) {
            //twitterLoginUsingFirebase(function (twitterLoginResult) {
            //    var a = twitterLoginResult;
            //});
            //var twitterLoginUrl = $twitterUrls.access_token_url;
            //e.preventDefault();

            //$twitterLogin(function (response) {
            //    switch (response.status) {
            //        case "SUCCESS":
            //            if (response.data) {
            //                window.open(response.data, "Ratting", "toolbar = 0, status = 0,")
            //                console.log('twitter window is open or closed?');
            //            } else {
            //                manageServerResponse(response);
            //            }
            //            break;
            //    }//switch (response.status) {
            //}); //$twitterLogin(function (redirectData) {
        }); //$('#icon_twitter').click(function (e) { 
        $('#icon_youtube').click(function (e) {
            e.preventDefault();
            initializeGoogle(true, function (youTubeResponse) {
                if (youTubeResponse) {
                    $saveLoginInfo('youtube', youTubeResponse.currentUser, null, function (nectorrResponse) {
                        manageServerResponse(nectorrResponse);
                    });//$saveLoginInfo(linkedInProfile, event, function (res) {
                    //alert("Success");
                }
            }, googlePlusDefaults.scopes.youTubeAuth, 'youtube', 'v3');

        });
        $('#icon_fb').click(function (e) {

//            $nectorrFacebookLogin(facebookDefaults.scope, e, function (data) {
            $nectorrFacebookLogin("email", e, function (data) {
                //$("#icon_fb").html('&#10003;')
                //$("icon_fb_img").fadeIn('fast');
                if (data) {
                    $saveLoginInfo('facebook', data.authResponse, null, function (serverResponse) {
                        manageServerResponse(serverResponse);
                    });//$saveLoginInfo(linkedInProfile, event, function (res) {

                } //if (data) { 
            });
            //var facebookLoginDetails = $nectorrFacebookLogin('email,public_profile',e);
            //{ scope: 'email,public_profile, user_posts, manage_pages, user_managed_groups, user_location' });
        }); //$('#icon_fb').click(function () {

        $('#icon_linkedin').click(function (e) {
            e.preventDefault();
            $nectorrLinkedInLogin('', 'auth', function (data) {
                var linkedInProfileData
                if (data.values) {
                    linkedInLogin = data.values[0];//g
                    linkedInProfileData = linkedInLogin;
                    var email = $getClientEmail();
                    
                    //var linkedInProfile = { registeredEmail: email, sm_name: 'linkedIn', loginInfo: linkedInProfileData };
                    $saveLoginInfo('linkedin', linkedInProfileData, event, function (res) {
                        manageServerResponse(res)
                    });//$saveLoginInfo(linkedInProfile, event, function (res) {
                }//if (data.values) {
                //save profile data
            });//$nectorrLinkedInLogin('', 'auth', function (data) {
        }); //$('#icon_linkedIn').click(function () { 

        $('#icon_google_plus').click(function () {
            //var profile;
            console.log('loggin in to Google');

            gapi.load('client:auth2', $initializeGoogleAuth2);
            // Initialize google authorization
            //initializeGoogleAuth2();
            //initializeGoogleAuth2()
            //googleLogin();

            //var auth2 = updateGoogleSignIn();
            //    console.log('getting profile info from Google');
            //var profile = authorizeAppForGplus(auth2);
            //    console.log('Verifying and processing  profile');
            //VerifyResultAndProcessForGooglePlus(profile);
        }); //$('#icon_google_plus').click(function () {
    }//if (!$isLoggedIn()) {
}); //$(document).ready(function () {
var VerifyResultAndProcessForGooglePlus= function (data,callback) {
    // read cookie information from request and response    
    if (!data.status.error) {
        var cookieData = data.nv;
        ManageCookies(cookieData);
    } else { 
        alert("ERROR : "+data.error.error);
    }
    //var cookieName = data.cn;

    // Manage google cookies
    // connect to server for encryption

}
var ManageAccordion = function() { 

}
var updateGoogleSignIn = function () {
    console.log('update sign in state');
    if (gapi.auth2.isSignedIn.get()) {
        console.log('signed in to Google');
        helper.onSignInCallback(gapi.auth2.getAuthInstance());
    } else {
        console.log('signed out of Google');
        helper.onSignInCallback(gapi.auth2.getAuthInstance());
    }
    return helper.onSignInCallback(gapi.auth2.getAuthInstance());
}
function googleLoginAndSave() { 

}
function googleLogin() {
    gapi.load('auth2', function () {
        gapi.client.load('plus', 'v1').then(function () {
            gapi.signin2.render('signin-button', {
                scope: 'https://www.googleapis.com/auth/plus.login',
                fetch_basic_profile: true
            });
            gapi.auth2.init({
                fetch_basic_profile: true,
                scope: 'https://www.googleapis.com/auth/plus.login'
            }).then(
                function () {
                    console.log('init');
                    auth2 = gapi.auth2.getAuthInstance();
                    auth2.isSignedIn.listen(updateGoogleSignIn);
                    auth2.then(function () {
                        authorizeAppForGplus();
                        VerifyResultAndProcessForGooglePlus(googleProfile);
                    });
                });
        });
    });
}
function VerifyResultAndProcessForTwitter(data) { 

}

var enableLoginItems = function () { }
var getCookieParams = function () {
}
$showMessage = function (divId, msg, msgType, show) {
    if (show) {
        var divIdentification = '#' + divId;
        switch (msgType) {
            case 'error':
                $(divIdentification).css('background-color', '#f62a24');
                manageMessage(divId,msg);
                break;
            case 'success':
                $(divIdentification).css('background-color', '#008CBA');
                manageMessage(divId, msg);
                break;
            case 'info':
                $(divIdentification).css('background-color', '#31bb37');
                manageMessage(divId, msg);
                break;
            default:
        }//switch (msgType) {
    } else {
        if ((show != null) && (show != undefined)) {
            $(divIdentification).hide();
        } //if ((show != null) && (show != undefined)) { 
    } //if (show) { 
}//$showMessage = function (divId,msg,msgType,show) { 
var manageMessage = function (divName,message) {
    var divIdentification = '#' + divName;
    $(divIdentification).hide();
//    $(divIdentification).css('font-family', 'GothamRounded-Book');
//    $(divIdentification).css('font-size', '12px');
    $(divIdentification).css('color', '#ffffff');
    $(divIdentification).css('padding-top', '5px');
    $(divIdentification).css('padding-left', '15px');
    $(divIdentification).css('padding-bottom', '5px');
    $(divIdentification).text(message);
    $(divIdentification).show();
    setTimeout(function () { }, 1500);

} //var manageMessage = function (divName) {
var VerifyResultAndProcessForFacebook = function (data, ev ) {
    if (data) {
        var email = $getClientEmail();
        var facebookProfile = { registeredEmail : email,sm_name:'facebook', loginInfo : data }
        $saveLoginInfo(facebookProfile, ev, function (data) {
            if (data) {
                ev.preventDefault();
                $showMessage('serverResponse', data.message, 'success', true, ev);
                $activeSocialMedia = 'facebook';
                var configureTab = $('#tab2');
                configureTab.attr('checked', true);
                //refresh tab2 iframe

            } //if (data) {
        }); //saveFacebookData(facebookProfile, ev, function (data) {
    } //if (data) { 
}//var VerifyResultAndProcessForFacebook = function (data) {
var displayTwitterFeed = function (data) {
    var feedsDiv = $('#feedsDiv');
    if (feedsDiv) {
        for (var counter = 0; counter < data.length; counter++) {
            feedsDiv.append(data.feed[counter]); //
        } // for (var counter = 0; counter < data.length; counter++) {
    } //if (feedsDiv) {
} //var displayTwitterFeed = function (data) {

 //var validateUserObjectAndShowMessage = function (user) { 
var authCreds = {
    " ": {
        'consumer_key': 'zR30W1z6cTQfYKaeMMrUdbXKm'
        , 'consumer_secret': 'W3k4tedpDKJ0hM6Hnn2I4hAHWag1INFw2ipaBOhgYBqt5zaxL2'
        , 'access_token': '103259010-9AtPODqSaurMAOaIiIfnJrr14TloFKXgx9wElaop'
        , 'access_token_secret': 'pJWeIvX69HhXr3f6WicjEbZfhWLDezcjUzcXbVBWsyEF5'
        , 'redirect_url': 'https://nectorr.com/auth/twitter/callback'
        // for updating to git once again and again
        //,
        //bearer_token:''
        //test
    },
    "instagram": { client_id: "f3a4940affd34bd7aaabebde1a685846" },
    "pinterest": { client_id: "4880455741651043731" },
    "google": { client_id: "102046510109174994539" }

}
var setIframeSrc = function (iframeName, fileName) {
    var iframe = $(iframeName);
    var s = fileName;
    //var iframe1 = document.getElementById('iframe1');
    if (-1 == navigator.userAgent.indexOf("MSIE")) {
        iframe.attr("src", s);
    }
    else {
        iframe.attr("location", s);
    }
}

var markHashTags = function (searchString) {
    var returnValue;
    if (!searchString) return " ";
    var searchArray = searchString.split(',');
    for (var counter = 0; counter < searchArray.length; counter++) {
        var searchTag = searchArray[counter].trim();
        if ((searchTag.charAt(0) != '!') && (searchTag.charAt(0) != '#') && (searchTag.charAt(0) != '@')) {
            searchTag = '#' + searchTag + " "
            searchArray[counter] = searchTag; 
        }//if ((searchTag.charAt(0) != '!') && (searchTag.charAt(0) != '#') && (searchTag.charAt(0) != '@')) {
    }//for (var counter = 0; counter < searchArray.length; counter++) {
    return searchArray.join(', ');
}//var markHashTags = function (searchString) {