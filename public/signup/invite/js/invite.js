var invitationCode;
jQuery(window).load(function () {
    $("#preloader").fadeOut("slow");
});
$(document).ready(function () {
    $("#signThemUp").click(function (e) {
        e.preventDefault();
        var inviteDetails = readInvitation();
        if (inviteDetails)
            updateInvitation(inviteDetails);
        //connect using jsonp
    }); //$("#submit_invitation").click(function () {
})//$(document).ready(function () {
var readInvitation = function () {
    var friendsName = $('#friendsName').val();
    var email = $('#email').val();
    var nickName = $('#nickName').val();
    var returnValue
    if ((friendsName) && (email)) {
        returnValue = { 'friendsName': friendsName, 'email': email, 'nickName': nickName };
    } else {
        alert("Friend's name and email are mandatory.");
    }
    return returnValue;
}

var updateInvitation = function(invitationDetails) {
    $.ajax({
        headers: { "Accept": "application/json" }
        , type: 'GET'
        , url: '/signup/invitation/manage'
        ,data: "invitation_details=" + JSON.stringify(invitationDetails)
        ,dataType: "jsonp"
        , jsonp: "callback"
        , crossDomain: true
        , beforeSend: function (xhr) {
            xhr.withCredentials = true;
        }
        ,jsonPCallback: "jsonpCallback"
        , success: function (data) {
            manageServerResponse(data);
            //VerifyResultAndProcessForGooglePlus(data);
            //$("#feeds").children().show();
        }
        , error: function (jqXHR, textStatus, errorThrown) {
            //var msgBox = $('#butrfly-login').find();
            alert("ERROR: " + textStatus + "DETAILS: " + errorThrown);
        }
    });
        
}
var manageServerResponse = function(data) {
    var response = data;
    //var response = JSON.parse(data)
    //alert("SUCCESS+" + data);
    //var $serverResponse = $document.find('#serverResponse');

    if (response.status =='ERROR') {
        //$('#serverResponse').style = 'color:#ffffff; background-color:rgba(243, 0, 0, 0.6)';
        $('#serverResponse').css('background-color', 'rgba(243, 0, 0, 0.6)');
        $('#serverResponse').css('color', '#ffffff');
    }
    else if (response.status=='SUCCESS'){
        $('#serverResponse').css('background-color', 'rgba(10, 185, 5, 0.6)');
        $('#serverResponse').css('color', '#ffffff');
    }
    $('#serverResponse').text(data.message);
    $('#serverResponse').show();
} //var manageServerResponse = function(data) {