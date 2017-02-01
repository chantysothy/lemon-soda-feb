
$(document).ready(function () {

    //alert("pageload event fired!");
});

$(window).resize(function () {
    var width = $(window).width();
    
    if (width < 600) {
        //alert("Width = "+width)
        $("#icon_display").attr("class", "col-md-8");
        $("#click_msg").attr("font-size", "20px");      
        $("#icon_fb").attr("src", "../img/social/facebook-64.png");
        $("#icon_google_plus").attr("src", "../img/social/google-plus-64.png");
        $("#icon_instagram").attr("src", "../img/social/instagram-64.png");
        $("#icon_twitter").attr("src", "../img/social/twitter-64.png");
        $("#icon_linkedin").attr("src", "../img/social/linkedin-64.png");
    }
    else {
        $("#click_msg").attr("font-size", "20px");
        $("#icon_display").attr("class", "col-md-2");
        $("#icon_fb").attr("src", "../img/social/facebook.png");
        $("#icon_google_plus").attr("src", "../img/social/google-plus.png");
        $("#icon_instagram").attr("src", "../img/social/instagram.png");
        $("#icon_twitter").attr("src", "../img/social/twitter.png");
        $("#icon_linkedin").attr("src", "../img/social/linkedin.png");
    }
});

$('#icon_fb111').click(
    function () {
        var userName = "Edward", password = "Pwd";
        //alert("userName" + userName);
        //r password = $('#butrfly-login').find("#login_password").val();
       // alert("Pwd:");
        //        var loginURL = "http://localhost:1773"+"/oauth/facebook";

        var loginURL = "/auth/facebook";
        var jsonString = '{"uName":"' + userName + '", "Pwd":"' + password + '"}';
        //alert("Creds : " + jsonString);
        //var userCreds = JSON.parse(jsonString);
        //alert("Creds : JSON string = " + JSON.stringify(jsonString));
        
        $.ajax({
            headers: { "Accept": "application/json" }
            , type: 'GET'

            , url: loginURL
            ,data: "Q=" + jsonString
            , dataType: "json"
            //, jsonp: "callback"
            , crossDomain: true
            //, beforeSend: function (xhr) {
            //    xhr.withCredentials = true;
            //}
            //jsonPCallback: "jsonpCallback",
            , success: function (data) {
                if (data.redirect) {
                    
                    //redirectToModal('dialog', data);
                    //switch if
                    window.location.href = data.redirect;
                }
                //alert("Success: " + JSON.stringify(data))
            }
            , error: function (jqXHR, textStatus, errorThrown) {
                //var msgBox = $('#butrfly-login').find();
                alert("ERROR: "+textStatus +"DETAILS: "+errorThrown);
            }
            //,crossDomain: true
        });
    });
(function (d, s, id) {
    var js, fjs = d.getElementsByTagName(s)[0];
    if (d.getElementById(id))
        return;
    js = d.createElement(s);
    js.id = id;
    js.src = "//connect.facebook.net/en_US/all.js";
    fjs.parentNode.insertBefore(js, fjs);
}(document, 'script', 'facebook-jssdk'));

window.fbAsyncInit = function () {
    FB.init({
        appId: '334582780223007',  // Change appId 409742669131720 with your Facebook Application ID
        status: true,
        xfbml: true,
        cookie: true
    });
};

$(document).ready(function () {
    $('.fb-share').click(function () {
        FB.ui({
            method: 'feed',
            name: 'Manoj Yadav',
            link: 'http://www.manojyadav.co.in/',
            picture: 'https://www.gravatar.com/avatar/119a8e2d668922c32083445b01189d67',
            description: 'Manoj Yadav a PHP Developer from Mumbai, India'
        });
    });
});

};