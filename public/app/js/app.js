$(window).load(function () {
    var googleAuthObject, facebookAuthObject, twitterAuthObject, instagramAuthObject, pinterestAuthObject, bloggerAuthObject;
    if (!$isLoggedIn()) {
        $('#invite').hide();
        $('#logout').hide();
        window.location.href = '/signup/local';
    } else {
        $('#invite').show();
        $('#logout').show();
        getQueryTags(function (searchOptions) {
            var publishCredentials = {
                // FACEBOOK
                facebook: {
                    accounts: ['10210758811476360'],
                    limit: 2,
                    access_token: '150849908413827|a20e87978f1ac491a0c4a721c961b68c'
                },
                // Twitter
                twitter: {
                    accounts: ['@edwardvarghese, #startup', '#fund'],
                    limit: 2,
                    consumer_key: 'zR30W1z6cTQfYKaeMMrUdbXKm', // make sure to have your app read-only
                    consumer_secret: 'W3k4tedpDKJ0hM6Hnn2I4hAHWag1INFw2ipaBOhgYBqt5zaxL2', // make sure to have your app read-only
                },
                // INSTAGRAM
                instagram: {
                    accounts: ['@extendmore', '#startup', '#fund'],
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
                    accounts: ['#startup', '#fund'],
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
                update_period: 5000,
                // When all the posts are collected and displayed - this function is evoked
                callback: function () {
                    console.log('all posts are collected');
                },
                template_html: '../template.html'
                //update_period : 300
            }
            fbConnect(function (response) {
                facebookAuthObject = response;
                publishCredentials.facebook.access_token = response.authResponse.accessToken;
                var instagramAuthUrl = "https://api.instagram.com/oauth/authorize/?client_id=" + "f3a4940affd34bd7aaabebde1a685846" + "&response_type=code"
                var feedDiv = $('#socialfeeds');
                $initializeGooglewithCallback(function (googleResponse) {
                    googleAuthObject = googleResponse.getAuthResponse();
                    var googleUser = googleResponse.getId();

                    var socialFeedLoginInfo = {
                        // INSTAGRAM
                        facebook: {
                            accounts: ['@' + facebookAuthObject.authResponse.userID],  //Array: Specify a list of accounts from which to pull posts
                            limit: 5,                                    //Integer: max number of posts to load
                            client_id: 'wj888T3jlauiQIjcdu751AELB', // make sure to have your app read-only
                            access_token: response.authResponse.accessToken, // make sure to have your app read-only
                        },
                        twitter: {
                            accounts: ['@edwardvarghese'],  //Array: Specify a list of accounts from which to pull posts
                            limit: 5,                                    //Integer: max number of posts to load
                            consumer_key: 'zR30W1z6cTQfYKaeMMrUdbXKm', // make sure to have your app read-only
                            consumer_secret: 'W3k4tedpDKJ0hM6Hnn2I4hAHWag1INFw2ipaBOhgYBqt5zaxL2', // make sure to have your app read-only
                        },
                        google: {
                            accounts: ['@' + googleUser],  //Array: Specify a list of accounts from which to pull posts
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
                    var searchDetails = ['Monitor', 'ListenTo', 'Engagement', 'Trending', 'ListenTo'];
                    for (var searchDetailsCounter = 0; searchDetailsCounter < searchDetails.length; searchDetailsCounter++) {
                        var searchData = searchOptions.StreamObject[searchDetails[searchDetailsCounter]].split(',');
                        pushArray(socialFeedLoginInfo.facebook.accounts, searchData);
                        pushArray(socialFeedLoginInfo.twitter.accounts, searchData);
                        pushArray(socialFeedLoginInfo.google.accounts, searchData);
                    }//for (var searchDetailsCounter = 0; searchDetailsCounter < searchDetails.length; searchDetailsCounter++) {
                    feedDiv.socialfeed(socialFeedLoginInfo);

                });

            });//fbconnect

        });
        //alert("social feed executed");

    }

}); //$(window).load(function () {
$(document).ready(function () {
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
    $("#icon_instagram").click(function (e) {
        var instagramAccessDetails;
        $getInstagramLogin(function (data) {
            instagramAccessDetails = data;
        });//$getInstagramLogin(function (data) 
    });
    $('#icon_twitter').click(function (e) {
        var twitterLoginUrl = $twitterUrls.access_token_url;
        e.preventDefault();

        $twitterLogin(function (response) {
            switch (response.status) {
                case "SUCCESS":
                    if (response.data) {
                        window.open(response.data, "Ratting", "toolbar = 0, status = 0,")
                        console.log('twitter windowis open or closed');
                    } else {
                        manageServerResponse(response);
                    }
                    break;
            }//switch (response.status) {
        }); //$twitterLogin(function (redirectData) {
    }); //$('#icon_twitter').click(function (e) { 

    $('#icon_fb').click(function (e) {
        $nectorrFacebookLogin('email,public_profile', e, function (data) {
            if (data) {
                VerifyResultAndProcessForFacebook(data, e);
            } //if (data) { 
        });
        //var facebookLoginDetails = $nectorrFacebookLogin('email,public_profile',e);
        //{ scope: 'email,public_profile, user_posts, manage_pages, user_managed_groups, user_location' });
    }); //$('#icon_fb').click(function () {
    
    $('#icon_linkedin').click(function () {
        $nectorrLinkedInLogin('', 'auth', function (data) {
            linkedInProfileData = data.values[0];//g
            var email = $getClientEmail();
            var linkedInProfile = { registeredEmail: email, sm_name: 'linkedIn', loginInfo: linkedInProfileData };
            $saveLoginInfo(linkedInProfile, event, function (res) {
                manageServerResponse(res);
            });//$saveLoginInfo(linkedInProfile, event, function (res) {
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
}); // pageload
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
    "twitter": {
        'consumer_key': 'zR30W1z6cTQfYKaeMMrUdbXKm'
        , 'consumer_secret': 'W3k4tedpDKJ0hM6Hnn2I4hAHWag1INFw2ipaBOhgYBqt5zaxL2'
        , 'access_token': '103259010-9AtPODqSaurMAOaIiIfnJrr14TloFKXgx9wElaop'
        , 'access_token_secret': 'pJWeIvX69HhXr3f6WicjEbZfhWLDezcjUzcXbVBWsyEF5'
        , 'redirect_url': 'http://localhost:1337/auth/twitter/callback'
        // for updating to git once again and again
        //,
        //bearer_token:''
        //test
    },
    "instagram": { client_id: "f3a4940affd34bd7aaabebde1a685846" },
    "pinterest": { client_id: "4880455741651043731" },
    "google": { client_id: "102046510109174994539" }

}
var fbConnect = function (callback) {
    $nectorrFacebookLogin("user_posts", null, callback);
}//var fbConnect = function (callback) {
