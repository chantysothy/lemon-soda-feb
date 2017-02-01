/* ========================================================================= */
/*	Preloader
/* ========================================================================= */

jQuery(window).load(function(){

	$("#preloader").fadeOut("slow");

});


$(document).ready(function(){

    /* ========================================================================= */
    /*	Setting the window width icons and classes
/* ========================================================================= */
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
        $("#click_msg").attr("font-size", "40px");
        $("#icon_display").attr("class", "col-md-2");
        $("#icon_fb").attr("src", "../img/social/facebook.png");
        $("#icon_google_plus").attr("src", "../img/social/google-plus.png");
        $("#icon_instagram").attr("src", "../img/social/instagram.png");
        $("#icon_twitter").attr("src", "../img/social/twitter.png");
        $("#icon_linkedin").attr("src", "../img/social/linkedin.png");
    }
    
    
    /* ========================================================================= */
	/*	Menu item highlighting
	/* ========================================================================= */

	jQuery('#nav').singlePageNav({
		offset: jQuery('#nav').outerHeight(),
		filter: ':not(.external)',
		speed: 1200,
		currentClass: 'current',
		easing: 'easeInOutExpo',
		updateHash: true,
		beforeStart: function() {
			console.log('begin scrolling');
		},
		onComplete: function() {
			console.log('done scrolling');
        }

	});
    /* ========================================================================= */
    /*	icon clicks
/* ========================================================================= */
    //$('#icon_fb').click(
    //    function () {
    //        //var userName = $('#butrfly-login').find("#login_username").val();
    //        //alert("userName" + userName);
    //        //r password = $('#butrfly-login').find("#login_password").val();
    //         alert("Pwd:");
    //        var loginURL = "http:localhost:1773" + "/auth/facebook";
    //        var jsonString = '{"uName":"' + userName + '", "Pwd":"' + password + '"}';
    //        //alert("Creds : " + jsonString);
    //        //var userCreds = JSON.parse(jsonString);
    //        alert("Creds : JSON string = " + JSON.stringify(userCreds));
            
    //        $.ajax({
    //            url: loginURL,
    //            data: "Q=" + jsonString,
    //            dataType: "jsonp",
    //            jsonPCallback: "jsonCallback",
    //            success: function (data) {
    //                if (data) {
    //                //VerifyResultAndProcess(data);
    //                }
    //                alert("Success: " + JSON.stringify(data))
    //            },
    //            error: function (jqXHR, textStatus, errorThrown) {
    //                //var msgBox = $('#butrfly-login').find();
    //                alert("ERROR: " + textStatus + "DETAILS: " + errorThrown);
    //            },
    //            crossDomain: true
    //        });
    //    });
	
    $(window).scroll(function () {
        if ($(window).scrollTop() > 400) {
            $("#navigation").css("background-color","#333333");
        } else {
            $("#navigation").css("background-color","#333333");
        }
    });
	
	/* ========================================================================= */
	/*	Fix Slider Height
	/* ========================================================================= */	

	var slideHeight = $(window).height();
	
	$('#slider, .carousel.slide, .carousel-inner, .carousel-inner .item').css('height',slideHeight);

	$(window).resize(function(){'use strict',
		$('#slider, .carousel.slide, .carousel-inner, .carousel-inner .item').css('height',slideHeight);
	});
	
	
	/* ========================================================================= */
	/*	Portfolio Filtering
	/* ========================================================================= */	
	
	
    // portfolio filtering

    $(".project-wrapper").mixItUp();
	
	
	$(".fancybox").fancybox({
		padding: 0,

		openEffect : 'elastic',
		openSpeed  : 650,

		closeEffect : 'elastic',
		closeSpeed  : 550,

		closeClick : true,
	});
	
	/* ========================================================================= */
	/*	Parallax
	/* ========================================================================= */	
	
	$('#facts').parallax("50%", 0.3);
	
	/* ========================================================================= */
	/*	Timer count
	/* ========================================================================= */

	"use strict";
    $(".number-counters").appear(function () {
        $(".number-counters [data-to]").each(function () {
            var e = $(this).attr("data-to");
            $(this).delay(6e3).countTo({
                from: 50,
                to: e,
                speed: 3e3,
                refreshInterval: 50
            })
        })
    });
	
	/* ========================================================================= */
	/*	Back to Top
	/* ========================================================================= */
	
	
    $(window).scroll(function () {
        if ($(window).scrollTop() > 400) {
            $("#back-top").fadeIn(200)
        } else {
            $("#back-top").fadeOut(200)
        }
    });
    $("#back-top").click(function () {
        $("html, body").stop().animate({
            scrollTop: 0
        }, 1500, "easeInOutExpo")
    });
	
});


// ==========  START GOOGLE MAP ========== //
function initialize() {
    var myLatLng = new google.maps.LatLng(28.5068545, 77.1978194);

    var mapOptions = {
        zoom: 14,
        center: myLatLng,
        disableDefaultUI: true,
        scrollwheel: false,
        navigationControl: false,
        mapTypeControl: false,
        scaleControl: false,
        draggable: false,
        mapTypeControlOptions: {
            mapTypeIds: [google.maps.MapTypeId.ROADMAP, 'roadatlas']
        }
    };

    var map = new google.maps.Map(document.getElementById('map_canvas'), mapOptions);


    var marker = new google.maps.Marker({
        position: myLatLng,
        map: map,
        icon: 'img/location-icon.png',
        title: '',
    });

}

google.maps.event.addDomListener(window, "load", initialize);
// ========== END GOOGLE MAP ========== //