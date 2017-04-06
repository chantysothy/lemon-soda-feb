﻿//jQuery(window).load(function () {
    
//});

var vignetteList = [];
var selectedOptions = [];
var selectedVignettes = [];
var timeLines = [];

var tempSocialMediaNames = ['facebook', 'twitter'];//'google'];//, 'linkedin','instagram','youtube', blogger','tumblr'];
//refer https://developers.google.com/+/domains/api/circles
var plusDomain = {
    getCircleList: 'https://www.googleapis.com/plusDomains/v1/people/userId/circles' //get
    , getACircle: 'https://www.googleapis.com/plusDomains/v1/circles/circleId' //get
    , addACircle: 'https://www.googleapis.com/plusDomains/v1/people/userId/circles' //post
    , removeCircle: 'https://www.googleapis.com/plusDomains/v1/circles/circleId'//DELETE

}

var year = new Date().getFullYear();
var month = new Date().getMonth();
var day = new Date().getDate();

var eventData = {
    events: [
        { "id": 1, "start": new Date(year, month, day, 12), "end": new Date(year, month, day, 13, 35), "title": "Launch of nectorr." }
    ]
};

var selectedPostableLocs = {};

//$(document).load(function (e) {
//    //$("#preloader").fadeOut("slow");

//    function displayMessage(message) {
//        $("#message").html(message).fadeIn();
//    }

//    //$calendar.weekCalendar("refresh");

//    var smElementCounter = 0;
//}); //$(window).load(function () { 
window.closeModal = function () {
    $('#iframeModal').modal('hide');
};
$(document).ready(function () {
    $('body').attr('color', '#333333');
    $('#newDateTime').click(function (ev) {
        ev.preventDefault();
        var divId = Date.now().toString();
        var newDiv = $('<div/>').insertAfter("#selectedTime");
        //newDiv.attr('class', 'input-group date col-xs-3');
        newDiv.attr('class', 'col-xs-3');      
        var newInput = $("<input type=\"text\" id=\"" + divId + "\" name=\"" + divId + '_input' + "\" class=\"timeline\" />").appendTo(newDiv);
        newInput.attr('placeholder', 'click to add timeline');
        //newInput.attr('color', '#ffffff');
        newInput.datetimepicker();
    });
    $('broadcastNow').hide();
    $('broadcastBtn').hide();
    var dateNow = Date();
    $("#manage-timelines").hide();

    getVignetteFromDb(function (data) {
        if (data.status = "SUCCESS") {
            vignetteList = curateVignetteList(data.data);
            //bind vignettelist to edit box
            $("#vignette-name").magicsearch({
                dataSource: vignetteList,
                fields: ['desc'],
                format: '%desc%',
                id: 'id',
                type: '',
                ajaxOptions: {},
                hidden: false,
                maxShow: 5,
                isClear: true,
                showSelected: true,
                dropdownBtn: false,
                dropdownMaxItem: 8,
                multiple: true,
                focusShow: false,
                //multiField: 'desc',
                multiStyle: { space: 5 },
                maxItem: true,
                noResult: 'no such vignette found.'
            });
            //$("#vignette-name").attr('id, desc');
            $("#vignette-name").attr('data-id', 'id, desc');
        } else {
            //display error message
        }//if (data.status = "SUCCESS") {

    });//getVignetteFromDb(function (data) {
}); //$(document).ready(function () {
$("#set-time").click(function (e) {
    e.preventDefault();
    $("#container_demo").hide();
    $("#manage-timelines").toggle("slide");

});

$('#go-back').click(function (e) {
    e.preventDefault();
    $("#manage-timelines").hide();
    $("#container_demo").toggle("slide");

});//$('#set-time').click(function (e) {

$('#schedule-now').click(function (e) {

    selectedVignettes = [];
    selectedVignettes = getSelectedVignettes();
    getTimeLines();// filled into global variable timeline.
    if (confirm('You want to post now ?')) {
        // Save it!
        if (timeLines.length > 0) {
            var dataForPost = { url: window.parent.shortUrlForServer, imgUrl: (!window.parent.imageUrlForServer) ? null : window.parent.imageUrlForServer, caption: window.parent.headingForServer, text: window.parent.textForServer, sm_names: ['facebook', 'twitter'], tokens: { fbAccessToken: window.parent.fbAccessToken } }
            var itemsToPost = { "vignettes": { vignettes: selectedVignettes }, "dataToPost": dataForPost, "timelines": { timeline: timeLines } }
            postUsingVignette(itemsToPost, function (data) {
            if (data.status == "SUCCESS") {
                manageServerResponse(data);
            } else {
                manageServerResponse(data);
            }
        });
        } else {
        // post now
        }
    } //if (confirm('You want to post now ?')) {

});//$('#btnPostNow').click(function (e) {

var curateVignetteList = function (listFromDB) {
    vignetteList = [];
    for (var vignetteCounter = 0; vignetteCounter < listFromDB.length; vignetteCounter++) {
        vignetteList.push({ id: listFromDB[vignetteCounter]._id, desc: listFromDB[vignetteCounter].vignette_name });
    }//for (var vignetteCounter = 0; vignetteCounter < listFromDB.length; vignetteCounter++) {
    return vignetteList;
}//var curateVignetteList = function (listFromDB) {
var manageServerResponse = function (data, multipleRecords = false) {
    if (!multipleRecords) {
        if (data) {
            if (data.status == 'ERROR') {
                $('#serverResponse').css('background-color', 'rgba(224, 0, 0, 0.6)');
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
var getSelectedVignettes = function () {
    var returnValue= []
    var multiItems = $(".multi-item").map(function () {
        return "'" + this.outerHTML + "'";
    }).get().join().split(',');
    for (var divCounter = 0; divCounter < multiItems.length; divCounter++) {
        var childItem = $(multiItems[divCounter]);
        var childText = childItem.attr('title');
        var childItemArray = childText.split('·');

        var elementId = childItem.attr('data-id');

        var vignette = { id: elementId, desc: childText };//, type: childItemArray[1], sm_name: childItemArray[0] };
        returnValue.push(vignette);

    }//for (var divCounter = 0; divCounter < childCounter; divCounter++){
    return returnValue;
}
var getTimeLines = function () {
    timeLines = [];
    $('.timelines').each(function () {
        if ($(this).val()) {
            timeLines.push(this);
        }
    });//$('.timelines').each(function () {
}//var getTimeLines = function () {