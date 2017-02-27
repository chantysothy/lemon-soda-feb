var noErrorsFound = false;

$(window).load(function () {
    //var verified_code = req.query.verified_code;
    //validateInvitation(verified_code);
});
$(document).ready(function () {
    $('#username').val(($getClientEmail()) ? $getClientEmail():"");   
        var validateInvitation = function (invitationCode) {
            $.ajax({
                headers: { "Accept": "application/json" }
                , type: 'GET'
                , url: '/signup/invitation/validate'
                ,data: "creds=" + JSON.stringify(invitationCode)
                ,dataType: "jsonp"
                , jsonp: "callback"
                , crossDomain: true
                , beforeSend: function (xhr) {
                    xhr.withCredentials = true;
                }
                ,jsonPCallback: "jsonpCallback"
                , success: function (data) {
                    //alert("SUCCESS+" + data);
                    $('username').text(data.email);
                    $('password').text('nectorr');
                    var status = { status: 'SUCCESS' , message: 'Click on the button for your first login.' }
                    manageServerResponse(status);

            //VerifyResultAndProcessForGooglePlus(data);
            //$("#feeds").children().show();
                }
                , error: function (jqXHR, textStatus, errorThrown) {
                    //var msgBox = $('#butrfly-login').find();
                    alert("ERROR: " + textStatus + "DETAILS: " + errorThrown);
                }
            });
        
        }//var validateInvitation = function(invitationCode) {
        
        var getLoginDetails = function () {
            var emailId = $('#username').val();
            var password = $('#password').val();
            var returnValue = { 'user_name': emailId, 'password': password };
            return returnValue;
        }//var getLoginDetails = function () { 
        var setCredentials = function (creds) {
            $('username').text(creds.email);
            $('password').text(creds.password);
        }//var setCredentials = function (creds) {
        
        var getInvitation = function (request) {
            return req.query.creds
        }//var getInvitation = function(request) { 
        $("#changePwd").click(function (e) {
            e.preventDefault();
            //var loginInfo = getLoginDetails();
            //validateLogin(loginInfo);
            if (noErrorsFound) {
                validateLogin(function (userCreds) {
                    if (userCreds.status == "SUCCESS") {
                        var userData = JSON.parse(userCreds.data);
                        if (userData.local.password == $('#oldPassword').val()) {
                            userData.local.password = $('#newPassword').val();
                            setLoginDetails(userData, function (serverStatus) {
                                manageServerResponse(serverStatus);
                            });//setPublishCredentials(userData, function (credsInfo) {
                        } else {
                            manageServerResponse({ status: "ERROR", message: "The password entered by you does not match our records." });
                        }
                    } else {
                        manageServerResponse(userCreds);
                    }
                });//$getCredsFromServer(userId, function (userCreds){
            } //if(noErrorsFound){
        }); //$("#signThemUp").click(function () { 
}); //$(document).ready(function () {

var validatePassword = function () {
    var userId = $('#username').val();
    var oldPwd = $('#oldPassword').val();
    var newPwd = $('#newPassword').val();
    var repeatPwd = $('#repeatPassword').val();
    if ((oldPwd && (oldPwd != "")) && (newPwd && (newPwd != "")) && (repeatPwd && (repeatPwd != ""))) {
        if (oldPwd != newPwd) {
            if (newPwd == repeatPwd) {
                noErrorsFound = true;
                $('#serverResponse').hide();
            } else {
                manageServerResponse({status : "ERROR",message : "New password and its repeat has to be an exact match."});
            }
        } else {
            manageServerResponse({ status: "ERROR", message: "Please enter a new password" });
        }
    } else {
        //check user id
        if (!userId || (userId == "")) {
            manageServerResponse({ status: "ERROR", message: "Please enter a valid user id." });
        }//if (userId || (userId == "")) {
    }//if ((oldPwd && (oldPwd != "")) && (newPwd && (newPwd != "")) && (repeatPwd && (repeatPwd != ""))) {
}//var validatePassword = function () {

var manageServerResponse = function (data) {
    var response = data;
    //var response = JSON.parse(data)
    //alert("SUCCESS+" + data);
    //var $serverResponse = $document.find('#serverResponse');

    if (response.status == 'ERROR') {
        //$('#serverResponse').style = 'color:#ffffff; background-color:rgba(243, 0, 0, 0.6)';
        $('#serverResponse').css('background-color', 'rgba(243, 0, 0, 0.6)');
        $('#serverResponse').css('color', '#ffffff');
    }
    else if (response.status == 'SUCCESS') {
        $('#serverResponse').css('background-color', 'rgba(10, 185, 5, 0.6)');
        $('#serverResponse').css('color', '#ffffff');
    }
    $('#serverResponse').text(data.message);
    $('#serverResponse').show();
}//var manageServerResponse = function(data) {

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
            //if ($isLoggedIn) { window.location.href = '/app/' }
                callback(data);
        }
        , error: function (jqXHR, textStatus, errorThrown) {
            alert("ERROR: " + textStatus + "DETAILS: " + errorThrown);
        }
    });

}//var validateLogin = function (invitationCode) {
