$.ajaxSetup({ dataType: "jsonp" });
$(document).ready(function () {
    $nectorrFacebookLogin("publish_actions, user_managed_groups, manage_pages, publish_pages, pages_show_list", null, function (data) {

    });//$nectorrFacebookLogin("user_posts", null, function (data) {

    $('#options-add-to-list').click(function (e) {
        // get the existing text in the box;
        //add this new text
    });//$('#options-add-to-list').click(function (e) {

    $('#btnSaveListenTo').click(function (e) {
        var params = getParams();
        submitConfiguration(params, function (data) {
            if (data.status == 'SUCCESS') {
                manageServerResponse(data); //addeed for uploadding to git
                updatePreferences(data.StreamObject);
            }//if (data.status == 'SUCCESS') {
        });
    });//$('#submitListenTo').click(function (e) {

    $('#btnSaveTrending').click(function (e) {
        var params = getParams();
        submitConfiguration(params, function (data) {
            if (data.status == 'SUCCESS') {
                updatePreferences(data.StreamObject);
            }//if (data.status == 'SUCCESS') {
        });
    });//$('#btnSaveTrending').click(function (e) {

    $('#btnSaveTracking').click(function (e) {
        var params = getParams();
        submitConfiguration(params, function (data) {
            if (data.status == 'SUCCESS') {
                updatePreferences(data.StreamObject);
            }//if (data.status == 'SUCCESS') {
        });
    });//$('#btnSaveTracking').click(function (e) {

    $('#btnSaveMonitor').click(function (e) {
        var params = getParams();
        submitConfiguration(params, function (data) {
            if (data.status == 'SUCCESS') {
                updatePreferences(data.StreamObject);
            }//if (data.status == 'SUCCESS') {
        });
    });//$('#btnSaveMonitor').click(function (e) {

    $('#btnSaveNotifications').click(function (e) {
        var params = getParams();
        submitConfiguration(params, function (data) {
            if (data.status == 'SUCCESS') {
                updatePreferences(data.StreamObject);
            }//if (data.status == 'SUCCESS') {
        });
    });//$('#btnSaveNotifications').click(function (e) {

    var submitConfiguration = function (params, callback) {
        $.ajax({
            headers: { "Accept": "application/json" }
            , type: 'GET'
            //        , url: twitterUrls.request_token_url
            , url: '/user-config/set'
            , data: "email=" + $getClientEmail() + "&StreamObject=" + JSON.stringify(params)
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

    }//var submitConfigure = function (location, parametere, callback) {

    var getTwitterStream = function (params, callback) {
        $.ajax({
            headers: { "Accept": "application/json" }
            , type: 'GET'
            //        , url: twitterUrls.request_token_url
            , url: '/stream/twitter'
            , data: "email=" + $getClientEmail()// + $getClientEmail() //+ "&StreamObject=" + JSON.stringify(params)
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

    }//var submitConfigure = function (location, parametere, callback) {

    var getConfiguration = function (callback) {
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
                alert("ERROR: " + textStatus + "DETAILS: " + errorThrown);
            }
        });

    }//var getConfiguration = function (callback) {

    var getParams = function () {
        var returnValue;
        var paramListenTo = $("#searchListenTo").val();
        var paramTrending = $("#searchTrending").val();
        var paramTracking = $("#searchTracking").val();
        var paramMonitor = $("#searchMonitor").val();
        var paramTraffic = $("#searchTraffic").val();
        var paramEngagement = $("#searchEngagements").val();
        returnValue = {
            ListenTo: paramListenTo
            , Trending: paramTrending
            , Tracking: paramTracking
            , Monitor: paramMonitor
            , Traffic: paramTraffic
            , Engagement: paramEngagement
        };
        return returnValue;
    } //var getParams = function () {
    var addCrossToCss = function () {

    }//var addCrossToCss = function () {
    if (!$isLoggedIn()) {
        window.location.href = '/signup/local';
        return;
    } else {
        var feedList = [];
        getConfiguration(function (data) {
            if (data.status == 'SUCCESS') {
                updatePreferences(data.StreamObject);
                getSocialFeeds(function (data) {
                    if (data.status == "SUCCESS") {
                        // do something
                    }//if (data.status == "SUCCESS") {
                });

                //getFacebookFeedNUpdate(data.StreamObject, function (data) {
                //    if (!data.status) {
                //    } else if (data.status == 'ERROR') {
                //        callback(data)
                //    } else if (data.status == "SUCCESS") {
                //        if (data.data.thisCount < data.data.totalCount) {
                //            feedList.push(data.data);
                //        }//if (data.data.thisCount < data.data.totalCount){

                //        //callback({ "status": "SUCCESS", message: 'facebook stream read for the specified keywords.', data: feedList });
                //    } else if (data.status == 'FINISH') {
                //        var a = 1;// for break point, to be removed
                //        getTwitterStream(null, function (data) {
                //            var temp = data
                //        });//getTwitterStream(null, function (data) {
                //        //Start populating feedList
                //            //FB.api('/'+
                //        //}
                //        publishFbPosts(feedList, function (data) {
                //            var temp = data;

                //    }); //publishFbPosts(feedList, function (data) {
                //    }//} else if (data.status == 'FINISH') {
                //});//getFacebookFeedNUpdate(function (data) {
            }//if (data.status == 'SUCCESS') {
        });//getConfiguration(function (data) {
    } //if (!$isLoggedIn()) {
    var getFacebookFeedNUpdate = function (StreamObject, callback) {
        if (callback) {
            var fbBatchArray = [];
            var KeywordsArray = StreamObject.ListenTo.split(',');
            var authResponse, feedCounter= 0;
            $nectorrFacebookLogin('user_posts,user_managed_groups, read_insights, read_audience_network_insights, manage_pages, publish_pages, publish_actions', null, function (fbAuthResponse) {
                authResponse = fbAuthResponse.authResponse;
                if (authResponse && !authResponse.error) {
                    for (var counter = 0; counter < KeywordsArray.length; counter++) {
                        var fbAPISearchString = "/me/feed?q=#" + KeywordsArray[counter] + "&access_token=" + fbAuthResponse.authResponse.accessToken;///search?q=" + KeywordsArray[counter] + "&type=post&access_token="+fbAuthResponse.authResponse.accessToken;
                        FB.api(fbAPISearchString, function (fbResponse) {
                            if (feedCounter < KeywordsArray.length - 1) {
                                callback({ status: "SUCCESS", message: "partial data only.", data: { data: fbResponse, totalCount: KeywordsArray.length, thisCount: feedCounter } });
                            } else {
                                var processCounter = 0, fbResult = fbResponse.data.data;
                                callback({ status: "SUCCESS", message: "partial data only.", data: { data: fbResponse, totalCount: KeywordsArray.length, thisCount: feedCounter } });

                                callback({ status: "FINISH", message: "Stream Object Parsed." });
                            }
                            feedCounter++;
                        });//FB.api(fbAPISearchString, function (fbResponse) {

                        //var batchCommand = { method: 'GET', relative_url: fbAPISearchString }
                        //fbBatchArray.push(batchCommand);
                    }//for (counter = 0; counter < KeywordsArray.length; counter++) {
                } else {
                    callback({ status: "ERROR", message: "Facebook/User did not authorize us fetch data" });
                    //callback error
                }//if (authResponse){
            });
        }//        if (callback) {
    };//    var getFacebookFeedNUpdate = function (StreamObject, callback) {
    var validateLogin = function (callback) {
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
                alert("ERROR: " + textStatus + "DETAILS: " + errorThrown);
            }
        });

    }//var validateLogin = function (invitationCode) {

    var publishFbPosts = function (fbDataArray, callback) {
        validateLogin(function (data) {
            var facebookId = data.facebook.id;
            var parentDocument = $('#iFrameSettings', parent.document);
            if (parentDocument) {
                var feedsDiv = parentDocument.context.getElementById('feeds');
                if (feedsDiv) {
                    for (var nodeCounter = 0; nodeCounter < fbDataArray.length; nodeCounter++) {
                        
                        var postArray = fbDataArray[nodeCounter].data.data;

                        for (var postCounter = 0; postCounter < postArray.length; postCounter++) {
                            var splitArray = postArray[postCounter].id.split('_');
                            var permaLink = "https://www.facebook.com/" + splitArray[0] + "/posts/" + splitArray[1];
//                            var postUrl = "https://www.facebook.com/" + facebookId + "/posts/" + postArray[postCounter].id;
                            //var postUrl = "https://www.facebook.com/" + postArray[postCounter].id;

//                            var divString = '<div id=feed' + postCounter + ' data-href=' + postUrl + ' class="fb-post col-md-4 col-lg-4" data-width=350>' + '</div>';
                            //                            var divString = '<div id=feed' + postCounter + ' data-href=' + postUrl + ' class="fb-post col-md4 col-lg-4" data-width=350>' + '</div>';
                            //                            var divString = '<fb:post id=feed' + postCounter + ' data-href=' + permaLink + ' class="fb-post col-md4 col-lg-4" data-width=350>' + '</fb:post>';
                            var newDiv = document.createElement("DIV");

                            var divString = '<div id=feed' + postCounter + ' data-href=' + permaLink + ' class="fb-post col-md4 col-lg-4" data-width=350>' + '</div>';
                            newDiv.innerHTML = divString;
                            //var newDiv = $(divString);
                            //$(divString).insertBefore("#feedBase");
                            $("#feedsDiv").app(newDiv);
                            newDiv.show();

                            //var temp = postArray[postCounter];
                        }//                    for (var postCounter = 0; postCounter < postArray[nodeCounter].length; postCounter++) {
                    }//for (var nodeCounter = 0; nodeCounter < postArray.length; nodeCounter++) {
                    FB.XFBML.parse();
                    $(feedsDiv).show();
                }//if (feedsDiv) {
            }//if (parentDocument) {

        });
    }//var publishFbPosts = function (postArray, callback) {

    var updatePreferences = function (data) {
        $("#searchListenTo").text(data.ListenTo);
        $('#searchTrending').text(data.Trending);
        $('#searchTracking').text(data.Tracking);
        $('#searchMonitor').text(data.Monitor);
        $('#searchTraffic').text(data.Traffic);
        $('#searchEngagements').text(data.Engagement);
    } //var updatePreferences = function (data) {

    var getFeed = function (callback) {
        $.ajax({
            headers: { "Accept": "application/json" }
            , type: 'GET'
            //        , url: twitterUrls.request_token_url
            , url: '/stream/fb'
            , data: "email=" + $getClientEmail() //v+ "&StreamObject=" + JSON.stringify(params)
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

    }//var getFeed = function(callback){
}); // page_load

var SocialMediaGroupsAndPages = {
    "facebook": {
        userId: "",
        access_token: "",
        getPostableLocs: function ( callback) {
            var returnValue = []; // calling function needs to look at returnValue.length>0 to proceed. This method shall run asynchronously.
            // get relevant scopes and login
            $nectorrFacebookLogin("user_managed_groups", function (data) {
                var user_id = "";
                FB.api("/" + user_id+"/groups",
                    function (response) {
                        if (response && !response.error) {
                            /* get pages*/
                            $nectorrFacebookLogin("manage_pages, publish_pages, pages_show_list", function (data) {
                                if (!data.error) {
                                    FB.api("/" + user_id + "/manage/accounts", function (data) {
                                        if (data && !data.error) {
                                            var pageValue = prepareArrayForPostableLocs("page", data);
                                            pushIntoArray(returnValue, pageValue);// correct data to come in
                                            if (callback) { callback(returnValue) } else return returnValue;
                                        } //if (data && !data.error) {
                                    }); //FB.api("/" + user_id + "/manage/accounts", function (data) {
                                }//if (!data.error) {
                            });//$nectorrFacebookLogin("user_managed_groups", function (data) {
                            pushIntoArrayArray(returnValue, response);
                        }//if (response && !response.error) {
                    } //function (response) {
                ); //FB.api("/" + user_id+"/groups",
            });//$nectorrFacebookLogin("", function (data) {
            
        }//getPostableLocs: function (userInfo) { 
    },//"facebook": {}
    "twitter": {
        screenName: "",
        getPostableLocs: function (callback) {
            var returnValue = [];// The calling function needs to check returnValue.length>0 to proceed.
            var codeBird = new Codebird;
            codeBird.setConsumerKey(twitterDefaults.consumer_key, twitterDefaults.consumer_secret);
            authenticateUsingCodebird(codeBird, function (response) {
                // get twitter List for the user
                if (response.status != "ERROR") {
                    codeBird.___call("", {}, function (reply, rate, err) {
                        if (err) {
                            manageServerResponse({ status: "ERROR", message: "ERROR : " + err.error });
                            return;
                        }//if (err) {
                        if (reply) {
                        }//if (err) {
                    });
                } else {
                    if (callback) { callback(response) } else return response;
                    //manageServerResponse(response);
                }//if (response.status != "ERROR") {
                // save response against the user
                var userId = $getClientEmail();

            });//authenticateUsingCodebird(codeBird, function (response) {
        } //getPostableLocs: function () {
    },//"twitter": {}
    "google": {
        userId: "",
        access_token: "",
        getPostableLocs: function () {
        },
        getFeaturedCollections: function () { }
    },//"google": {}
    "instagram": {
        user_id: "",
        access_token: "",
        getPostableLocs: function () {
        }
    }, //"instagram": {}
    "pinterest": {
        user_id: "",
        access_token: "",
        getPostableLocs: function () {

        }//getPostableLocs: function () {
    }, //pinterest
    "linkedin": {
        userId: "",
        access_token: "",
        getPostableLocs: function () {
        }//        getPostableLocs: function () {
    } //linkedIn

} //var SocialMediaGroupsAndPages = {

var pushIntoArray = function (toArray, fromArray) {
    for (var fromArrayCounter = 0; fromArrayCounter < fromArray.length; fromArrayCounter++){
        if (fromArray[fromArrayCounter]) {
            toArray.push(fromArray[fromArrayCounter]);
        }//if (fromArray[fromArrayCounter]) {
    } //for (var fromArrayCounter = 0; fromArrayCounter < fromArray.length, fromArrayCounter++){
    return toArray;
}//var pushIntoArray = function (toArray, fromArray) {

var prepareArrayForPostableLocs = function (type,result) {
    // sample record- { type: "page", pageInfo: data }
    var returnValue = [];
    for (var counter = 0; counter < result.length; counter++) {
        var record = { 'type': type, 'data' : result[counter] }
        returnValue.push(record);
    }//for (var counter = 0; counter < result.length; counter++) {
    return returnValue;
} //var prepareArrayForPostableLocs = function (result) {
var authenticateUsingCodebird = function (cb, callback) {
    // gets a request token
    var returnValue= []
    cb.__call(
        "oauth_requestToken",
        { oauth_callback: "oob" },
        function (reply, rate, err) {
            if (err) {
                callback({ status: "ERROR", message: "ERROR: "+err.error});
                return;
            }//if (err) {
            if (reply) {
                cb.setToken(reply.oauth_token, reply.oauth_token_secret);

                // gets the authorize screen URL
                cb.__call(
                    "oauth_authorize",
                    {},
                    function (auth_url) {
                        window.codebird_auth = window.open(auth_url);
                        // stores reply
                        callback(reply);
                    }//cb.__call(
                );//cb.__call(
            }//if (reply) {
        } //function (reply, rate, err) {
    );//cb.__call(
}//var authenticateUsingCodebird = function (cb, callback) { 
