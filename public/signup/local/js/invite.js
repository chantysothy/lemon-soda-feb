var invitationCode;
$(window).load(function () {
    //var verified_code = req.query.verified_code;
    //validateInvitation(verified_code);
    $isLoggedIn();
        $("#preloader").fadeOut("slow");
});
$(document).ready(function () {
        var validateLogin = function (loginDetails) {
            $.ajax({
                headers: { "Accept": "application/json" }
                , type: 'GET'
                , url: '/signup/login'
                ,data: "login_details=" + JSON.stringify(loginDetails)
                ,dataType: "jsonp"
                , jsonp: "callback"
                , crossDomain: true
                , beforeSend: function (xhr) {
                    xhr.withCredentials = true;
                }
                ,jsonPCallback: "jsonpCallback"
                , success: function (data) {
                    if (data) {
                        //data = JSON.parse(data);
                        if (data.status == 'SUCCESS') {
                            var cookieValue = JSON.stringify({ e: loginDetails.user_name, s: 1 });
                            manageServerResponse(data);
                            $manageCookies(cookieValue);
                            if ($isLoggedIn) { window.location.href = '/app/' }
                        } else { // show error
                            manageServerResponse(data);
                        } //if (data.status == 'SUCCESS') {
                    }//if (data) {
                }
                , error: function (jqXHR, textStatus, errorThrown) {
                    alert("ERROR: " + textStatus + "DETAILS: " + errorThrown);
                }
            });
        
        }//var validateLogin = function (invitationCode) {
        
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
        var setCredentials = function (creds) {
            $('username').text(creds.email);
            $('password').text(creds.password);
        }//var setCredentials = function (creds) {
        
        var getInvitation = function (request) {
            return req.query.creds
        }//var getInvitation = function(request) { 
        $("#btnLogin").click(function (e) {
            e.preventDefault();
            var loginInfo = getLoginDetails();
            validateLogin(loginInfo);
        }); //$("#signThemUp").click(function () { 

}); //$(document).ready(function () {


