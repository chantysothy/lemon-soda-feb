$.ajaxSetup({ dataType: "jsonp" });
jQuery(window).load(function () {
    $("#preloader").fadeOut("slow");
});

$(document).ready(function () {
    //$nectorrFacebookLogin("publish_actions, user_managed_groups, manage_pages, publish_pages, pages_show_list", null, function (data) {
    getConfiguration(function (data) {
        if (data.status == "SUCCESS") {
            updatePreferences(data.StreamObject);
        } else {
            manageServerResponse(data);
        }
    });//getConfiguration(function (data) {
    //});//$nectorrFacebookLogin("user_posts", null, function (data) {

    $('#options-add-to-list').click(function (e) {
        // get the existing text in the box;
        //add this new text
    });//$('#options-add-to-list').click(function (e) {

    $('#btnSaveListenTo').click(function (e) {
        $("#preloader").fadeIn("fast");
        var params = getParams();
        submitConfiguration(params, function (data) {
            if (data.status == 'SUCCESS') {
                manageServerResponse(data); //addeed for uploadding to git
                $("#preloader").fadeOut("fast");
                updatePreferences(data.StreamObject);
            } else {
                $("#preloader").fadeOut("fast");
                manageServerResponse(data); //addeed for uploadding to git
            }//if (data.status == 'SUCCESS') {
        });
        $("#preloader").fadeOut("fast");// to be removed
    });//$('#submitListenTo').click(function (e) {

    $('#btnSaveTrending').click(function (e) {
        var params = getParams();
        $("#preloader").fadeIn("fast");

        submitConfiguration(params, function (data) {
            if (data.status == 'SUCCESS') {
                $("#preloader").fadeOut("fast");
                updatePreferences(data.StreamObject);
            } else {
                $("#preloader").fadeOut("fast");
                manageServerResponse(data); //addeed for uploadding to git
            }//if (data.status == 'SUCCESS') {//if (data.status == 'SUCCESS') {
            $("#preloader").fadeOut("fast");// to be removed
        });
    });//$('#btnSaveTrending').click(function (e) {

    $('#btnSaveTracking').click(function (e) {
        $("#preloader").fadeIn("fast");
        var params = getParams();
        submitConfiguration(params, function (data) {
            if (data.status == 'SUCCESS') {
                $("#preloader").fadeOut("fast");
                updatePreferences(data.StreamObject);
            } else {
                $("#preloader").fadeOut("fast");
                manageServerResponse(data); //addeed for uploadding to git
            }//if (data.status == 'SUCCESS') {//if (data.status == 'SUCCESS') {
        });
    });//$('#btnSaveTracking').click(function (e) {

    $('#btnSaveMonitor').click(function (e) {
        $("#preloader").fadeIn("fast");
        var params = getParams();
        submitConfiguration(params, function (data) {
            if (data.status == 'SUCCESS') {
                $("#preloader").fadeOut("fast");
                updatePreferences(data.StreamObject);
            } else {
                $("#preloader").fadeOut("fast");
                manageServerResponse(data); //addeed for uploadding to git
            }//if (data.status == 'SUCCESS') {//if (data.status == 'SUCCESS') {
        });
    });//$('#btnSaveMonitor').click(function (e) {

    $('#btnSaveNotifications').click(function (e) {
        $("#preloader").fadeIn("fast");
        var params = getParams();
        submitConfiguration(params, function (data) {
            if (data.status == 'SUCCESS') {
                $("#preloader").fadeOut("fast");
                updatePreferences(data.StreamObject);
            } else {
                $("#preloader").fadeOut("fast");
                manageServerResponse(data);
            }//if (data.status == 'SUCCESS') {
        });
    });//$('#btnSaveNotifications').click(function (e) {


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



    var updatePreferences = function (data) {
        $("#searchListenTo").text(data.ListenTo);
        $('#searchTrending').text(data.Trending);
        $('#searchTracking').text(data.Tracking);
        $('#searchMonitor').text(data.Monitor);
        $('#searchTraffic').text(data.Traffic);
        $('#searchEngagements').text(data.Engagement);
        //animate tabs
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

