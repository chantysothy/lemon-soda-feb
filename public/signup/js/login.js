var invitationCode;
$(document).load(function (req, err) {
});
$(document).ready(function () {
    var temp = window.parent.document;
    var invitationCode = getParameterByName('inv_code');
    if (invitationCode) {
        $('#invitation_code').text(invitationCode);
    } //if (invitationCode) {

    $("#submit_invitation").click(function (e) {
        e.preventDefault();
        var invitationCode = readInvitationCode();
        validateInvitationCode(invitationCode, function (data) {
            if (data.status = 'SUCCESS') {
                setTimeout(2000);
                window.location.href = '/signup/local';
            } else {
                alert("This invitation code seems invalid. Please try a new one later.");
            }
        });
                //connect using jsonp
    }); //$("#submit_invitation").click(function () {
})//$(document).ready(function () {

var readInvitationCode = function () { 
    var returnValue = { 'invitation_code' : $('#invitation_code').val() };
    return returnValue;
}
var validateInvitationCode = function(code) {
    $.ajax({
        headers: { "Accept": "application/json" }
        , type: 'GET'
        , url: '/signup/invitation/validate'
        ,data: "creds=" + JSON.stringify(code)
        ,dataType: "jsonp"
        , jsonp: "callback"
        , crossDomain: true
        , beforeSend: function (xhr) {
            xhr.withCredentials = true;
        }
        ,jsonPCallback: "jsonpCallback"
        , success: function (data) {
            //var serverResponse = JSON.parse(data)
            //alert("SUCCESS+" + data);
            manageServerResponse(data);
            if (callback) {
                callback(data);
            }
            //VerifyResultAndProcessForGooglePlus(data);
            //$("#feeds").children().show();
        }
        , error: function (jqXHR, textStatus, errorThrown) {
            //var msgBox = $('#butrfly-login').find();
            alert("ERROR: " + textStatus + "DETAILS: " + errorThrown);
        }
    });
        
}

var manageServerResponse = function (data) {
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
            setTimeout(5000);
    }//if (data) {
}//var manageServerResponse = function(data) {
var getCreds = function() { 
    var returnValue = {email: $}
}
var getParameterByName = function (name) //courtesy Artem
{
    name = name.replace(/[\[]/, "\\\[").replace(/[\]]/, "\\\]");
    var regexS = "[\\?&]" + name + "=([^&#]*)";
    var regex = new RegExp(regexS);
    var results = regex.exec(window.location.href);
    if (results == null)
        return "";
    else
        return decodeURIComponent(results[1].replace(/\+/g, " "));
}

