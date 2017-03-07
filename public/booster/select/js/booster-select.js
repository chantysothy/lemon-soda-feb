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

$(window).load(function (e) {


    function displayMessage(message) {
        $("#message").html(message).fadeIn();
    }

    //$calendar.weekCalendar("refresh");

    var smElementCounter = 0;
}); //$(window).load(function () { 
window.closeModal = function () {
    $('#iframeModal').modal('hide');
};
$(document).ready(function () {
    $("#manage-timelines").hide();
    $('#time-line').datetimepicker({
        i18n: {
            de: {
                months: [
                    'January', 'February', 'Märch', 'April',
                    'May', 'June', 'July', 'August',
                    'September', 'October', 'November', 'December',
                ],
                dayOfWeek: [
                    "Sunday.", "Monday", "Tuesday", "Wednesday",
                    "Thursday", "Friday", "Saturday",
                ]
            }
        },
        timepicker: truee,
        format: 'm.d.Y'
    });

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

        } else {
            //display error message
        }//if (data.status = "SUCCESS") {

    });//getVignetteFromDb(function (data) {
}); //$(document).ready(function () {
$("schedule-now").click(function (e) {
    e.preventDefault();
    $("#divSetCalendar").hide();
    $("#container_demo").toggle("slide");

});

$('#set-time').click(function (e) {
    e.preventDefault();
    $("#container_demo").toggle("slide");
    $("#divSetCalendar").effect("slide");

});//$('#set-time').click(function (e) {

$('#schedule-now').click(function (e) {
    selectedVignettes = [];
    selectedVignettes = $window.parent.jQuery("#vignette-name").val();
    var selectModal = window.parent.jQuery('#selectVignette');//$.fn.animatedModal;//window.parent.jQuery('#selectVignetteModal');//.dialog('close');
    var dataForPost = { url: window.parent.shortUrlForServer, imgUrl: (!window.parent.imageUrlForServer) ? null : window.parent.imageUrlForServer, caption: window.parent.headingForServer, text: window.parent.textForServer, sm_names: ['facebook', 'twitter'], tokens: { fbAccessToken: window.parent.fbAccessToken}}
    return false;
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
