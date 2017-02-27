

$(window).load(function (e) {
    getVignetteDetails(function (vignetteInfo) {
        var vignetteDetails = vignetteInfo.data;
        $('#vignetteTable').DataTable({
            "data": vignetteDetails,
            "columns": [
                { "title": "Vignette Name", "data": "vignette_name" }
                //,{
                //    "title": " ", "data": "data.locs", "width": 50, "render": function (data, type, row, meta) {
                //        var json = JSON.parse(data);
                //        var icon = "<i class='fa " + json.sm_name + "'></i>"
                //        return icon;
                //    }
                //}
                //{ "title": "Title", "data": locs},
                //{ "title": "Title", "data": vignette_name },
            ]
        });
        //for (var vignetteCounter = 0; vignetteCounter < vignetteDetails.length; vignetteCounter++) {
        //    var postableLocs = vignetteDetails[vignetteCounter].data.locs
        //    for (var locsCounter = 0; locsCounter < postableLocs.length; postableLocs++) {
        //        var locDetails = JSON.parse(postableLocs[locsCounter]);
        //        var postableLocGrid = $("#vignetteTable");
        //        bindLocDetailsToGrid(locDetails, postableLocGrid)
        //    }//for (var locsCounter = 0; locsCounter < postableLocs.length; postableLocs++) {
        //}//for (var vignetteCounter = 0; vignetteCounter < vignetteDetails.length; vignetteCounter++) {

    });//getVignetteDetails(function (vignetteInfo) {
}); //$(window).load(function () { 

$(document).ready(function () {
    validateLogin();
    
    $('#btnSelect').click(function (e) {


        e.preventDefault();
    });//$('#btnSelect').click(function (e) {

    $('#btnSave').click(function (e) {


        e.preventDefault();
    });//$('#btnSave').click(function (e) {
    //getVignetteDetails(function (data) {
    //    //bindToGrid
    //});//getVignetteDetails(function (data) {
}); //$(document).ready(function () {


var bindLocDetailsToGrid = function(locs, grid){

}//var bindLocDetailsToGrid= function(locs, grid){

var manageServerResponse = function (data, multipleRecords = false) {
    if (!multipleRecords) {
        if (data) {
            if (data.status == 'ERROR') {
                $('#serverResponse').css('background-color', 'rgba(243, 0, 0, 0.6)');
                $('#serverResponse').css('color', '#ffffff');
            } else if (data.status == 'SUCCESS') {
                $('#serverResponse').css('background-color', 'rgba(10, 185, 5, 0.6)');
                $('#serverResponse').css('color', '#ffffff');
            } //if (data.status == 'ERROR') {
            $('#serverResponse').text(data.message);
            $('#serverResponse').show();

        }//if (data) {
    } else {
        var serverResponse = $('#serverResponse');
        var errorList = data;
        $.each(errorList, function (element) {
            var childDiv = $("<div>" + element.message + "</div>");
            if (element.status == 'ERROR') {
                childDiv.css('background-color', 'rgba(243, 0, 0, 0.6)');
                childDiv.css('color', '#ffffff');
            } else if (element.status == 'SUCCESS') {
                childDiv.css('background-color', 'rgba(10, 185, 5, 0.6)');
                childDiv.css('color', '#ffffff');
            } //if (data.status == 'ERROR') {
            $(childDiv).appendTo(serverResponse);
        });//$.each(errorList, function (element) {
    }//if (!multipleRecords) {
}//var manageServerResponse = function(data) {

var validateLogin = function () {
    if ($isLoggedIn()) {
        var signInId = $getClientEmail();
        // get connected social media
        if (signInId) {
            getConnectedSocialMedia = getSocialMediaDetails(signInId);
        } else {
            window.location.href = '/signup/local';
        }//if (signInId) {
    } else {
        window.location.href = '/signup/local';
    }//if($isLoggedIn()){
}//var validateLogin = function () {

var getSocialMediaDetails = function (email) {
    var returnValue;
    if (email) {
        $getCredsFromServer(email, function (data) { 
                permsFromServer = JSON.parse(data.data);
                getConnectedSocialMedia = permsFromServer;

        });
    }//if (email) { 
    //return returnValue;
}//var getSocialMediaDetails = function (signInId) { 
var getPermsFromServer = function (sm_name, callback) {
    var signInId = $getClientEmail();
    if (!signInId) {
        window.location.href('/signup/local');
        return;
    }
    if (callback) {

        if (sm_name) {
            switch (sm_name) {
                case 'facebook':
                    // get user email profile
                    //create a new object with pages and groups
                    $getCredsFromServer(signInId, function (creds) {
                        var credObj = JSON.parse(creds);
                        var returnObject = { email: signInId, groupsInfo: credObj.facebook.groupsData, pageInfo: credObj.facebook.pagesData };
                        callback(returnObject);
                    });

                    break;

                case 'twitter':
                    break;
                case 'instagram':
                    break;
                case 'pinterest':
                    break;
            }//switch (sm_name) {
        }//if (sm_name) { 
    } //if (callback) { 
}//var getPermissionsFromClient = function () { 

var getVignetteDetails = function (callback) {
    getVignetteFromDb(function (data) {
        var returnValue = data;
        //process data here
        if (callback) {
            callback(returnValue);
        }//if (callback) { 
    });//getVignetteFromDb(function (data) {
}//var getVignetteDetails = function (callback) {
var replaceSpecialChars = function (input, replaceThis, replaceWith) {
    input.data = input.data.replace(replaceThis, replaceWith);
    return input
}//var replaceSpecialChars = function (input, replaceThis, replaceWith) {
