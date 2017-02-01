var fbScope = "manage_pages, user_managed_groups";
var boostingProfile;
var getConnectedSocialMedia;
var twitterScope, googlePlusScope, linkedInScope, instagramScope 
var iconUrl = ['../img/social/facebook-64.png', '../img/social/twitter-64.png', '../img/social/google-plus-64.png', '../img/social/instagram-64.png', '../img/social/linkedin-64.png', '../img/social/tumblr-64.png'];// Array
var iconValue = ['facebook', 'twitter', 'googlePlusUser', 'instagram', 'linkedin', 'tumblr'];
var selectedSocialMediaList = $('#selectedSocialMediaList');
var boostingResources = [];    
var slideIndex = 1;
var imageList;

$(window).load(function (e) {
    //ShowAvailableSocialMediaIcons();//
}); //$(window).load(function () { 

$(document).ready(function () {
    //createBoostingProfile();
    $('#linkedIn').click(function (ev) {
        iconClick(ev, 'linkedin');
        
    });//$('#linkedIn').click(function (e) {
    $('#twitter').click(function (ev) {
        iconClick(ev,'twitter');
    });
    $('#facebook').click(function (e) {
        iconClick(e, 'facebook');
    });

    $('#boosterTextArea').bind("paste", function (e) {
        // access the clipboard using the api
        var pastedData = e.originalEvent.clipboardData.getData('text');
        //$('#boosterTextArea').val(pastedData);
        // preview pane
        var baseUrl = getBaseUrl(pastedData);    
        
        // google shortner
        shortenUrl(pastedData, function (data) {
            var shortUrl = data.shortUrl;
            $('#boosterTextArea').val(shortUrl);
            $("#boosterPreview").attr("src", shortUrl);
            // get list of images
            getHTML(pastedData, function (html) {
                var h1Data = html.find('h1');
                var parentDiv = h1Data[0].parentElement;
                $("#h1Text").text(h1Data[0].innerText);
                var paras = html.find('p');
                var para = paras[0].innerText, strLen;
                if (para.length > 97) { strLen = 97 } else { strLen = para.length - 1 }
                para = para.substr(0, strLen);
                para += '...';
                $('#paraText').text(para);
            
                slideIndex = 0;
                imageList = html.find('img');
                imageList = cleanImageList(imageList);
                //imageList = $(parentDiv).children('img').map(function () { return $(this) }).get();
                plusDivs(slideIndex);// display images
                //addImageListToDiv("", imageList);
                //showDivs(slideIndex);
            });//getElementsFromUrl(pastedData, 'h1', function (h1Data) {


        });//shortenUrl(pastedData, function (data) {
    }); //$('booster')..bind("paste", function (e) {



    //if (!getConnectedSocialMedia) {
    //    getConnectedSocialMedia = getPerms();
    //}
    validateLogin();
}); //$(document).ready(function () {
var addImageListToDiv = function (divName, imgList) {
    if (!divName || !imgList) return;
    
    for (var counter = imgList.length-1; counter >=0; counter--) {
        var currentImage = imgList[counter];
        $('#' + divName).prepend($('<img>', { id: 'Img' + counter, src: currentImage.src, class: 'boosterImages' }))
    }//for (var counter = 0; counter < imgList.length; counter++) {
} //var addImageListToDiv = function (divName, imgList) {
var cleanImageList = function (imgList) {
    var returnValue = [];
    for (var counter = 0; counter < imgList.length; counter++) {
        var item = imgList[counter];
        if (item.height > 100 && item.width > 100) {
            returnValue.push(item);
        }
    }//for (var counter = 0; counter < imgList.length; counter++) {
    return returnValue;
}//var cleanImageList = function (imgList) {
var plusDivs= function (n) {
    //showDivs(slideIndex += n);
    if (imageList.length <n)
    $("#imageHolder").html("<img src=\"" + imageList[slideIndex].src + "\">");
}//function plusDivs(n) {


var getElementsFromHTML = function (html, element) {
    // expects a HTML DOM Object
    return html.find(element);
    
}//var getElementsFromHTML = function (html, element) {

var getElementsFromDivs = function (div, element) {
    var returnValue;
    returnValue = $(div).children(element).map(function () { return $(this) }).get();
    return returnValue;
}//var getElementsFromDivs = function (div, element) {


var getHTML = function (url, callback) {
    var a = document.createElement('a');
    a.href = url;
    var urlReq = { host: a.hostname, path: a.pathname + a.search,uri:url }
    $.ajax({
        headers: { "Accept": "application/json" }
        , type: 'GET'
        , url: '/get/html'
        , data: "urlPath=" + JSON.stringify(urlReq)
        , dataType: "jsonp"
        , jsonp: "callback"
        , crossDomain: true
        , beforeSend: function (xhr) {
            xhr.withCredentials = true;
        }
        , jsonPCallback: "jsonpCallback"
        , success: function (data) {
            if (data.status == 'SUCCESS') {
                var html = data.data;
                //var elementList = $(html).find(element);
                if (callback) {
                    callback($(html));
                }
            } else {
                manageServerResponse(data);
            }//if (data.status== 'SUCCESS'){
        }//success: function (data) {
        , error: function (jqXHR, textStatus, errorThrown) {
            //var msgBox = $('#butrfly-login').find();
            alert("ERROR: " + textStatus + "DETAILS: " + errorThrown);
        }//error: function (jqXHR, textStatus, errorThrown) {
    });
} //var getElementsFromUrl = function (url, element, callback) {

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

    }//if (data) {
}//var manageServerResponse = function(data) {

var shortenUrl = function (longUrl, callback) {
    gapi.client.setApiKey('AIzaSyAysc2oWDZuqMhUGWtZPSxdJdACoc1AyU4'); 
    gapi.client.load('urlshortener', 'v1', function (data) {
        //alert('Google url shortner loaded' + data);
        var request = gapi.client.urlshortener.url.insert({
            'resource': {
                'longUrl': longUrl
            }
        }); //var request = gapi.client.urlshortener.url.insert({
        request.execute(function (response) {
            var returnValue = { shortUrl: response.id };
            if (callback) {
                callback(returnValue);
            } else {
                return returnValue;
            } //if (callback) {
        });//request.execute(function (response) {

    });

} //var gapiLoad = function () {

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

var ShowAvailableSocialMediaIcons = function () {
    if(getConnectedSocialMedia) {
        //var li = $("li");
        //var ul = document.createElement('ul');
        var smList = $('#selectedSocialMediaList');
//        var socialMedia = $('selectedSocialMediaList').find('div,img').get();
        var socialMedia = smList.find('.booster-icons');
        var className = 'col-md-8 col-lg-8';
        for (var counter = 0; counter < socialMedia.length; counter++) {
            //var ul = $('ul');
            //var li = document.createElement('li');
            //var img = $("img");
            //var img = document.createElement('img');

            //var img = $(document).createElement('IMG');
            var permsKey = $getJsonValues(getConnectedSocialMedia, iconValue[counter]);
            if (permsKey.length > 0) {
                greyedIcon(socialMedia[counter]);
            } else { 
               // getPermissionsFromClient(iconValue[counter]);
            } //if (permsKey.length>0) {
            //var a = $('a');
            //var img = $('<img>');
            //img.attr('id', iconValue[counter]);
            //img.attr('src', iconUrl[counter]);
            //img.attr('onClick', 'iconClick(' + iconValue[counter] + ')')
            //img.addClass(className);
            //img.id = iconValue[counter];
            //img.src = iconUrl[counter];
            //img.className = className;
            //img.onclick = iconClick(iconValue[counter]);

            //var a = document.createElement('a');
            
            //var a = $('<a>');
            //a.attr('id', 'a'+counter);
            //a.attr('href', '#');
            //a.prepend(img.outerHTML);
            //a.prepend(img);
            
            //var div = $('<div>');
            //div.attr('id', 'div' + counter);
            //div.attr('class', className);
            //div.prepend(a);
            //a.attr('href', '#'); 
            //a.append($('<img>', {id:iconValue[counter], src: iconUrl[counter], class:className,onclick:'iconClick('+iconValue[counter]+')'}));
            //
            //loadImage(iconUrl[counter], smList);
            //smList.prepend(outerHtml);
//            smList.prepend(img.outerHTML);
            //selectedSocialMediaList.prepend(div.outerHTML);
            //li.append(a.outerHTML);
            //ul.append(li.outerHTML);
            //$(a).add(img);
            //$(li).add(a);
            //$(ul).add(li);
        //$div.click(function () { /* ... */ });
        }//for (var counter = 0; counter < iconUrl.length; counter++) { 
        //$('ul').appendTo(selectedSocialMediaList);
        //document.body.appendChild(ul);
        //$('selectedSocialMediaList').prepend(ul.outerHTML);
         //$('selectedSocialMediaList').outerHTML(ul.outerHTML);
        //$('selectedSocialMediaList').attr('outeHTML',ul.outerHTML);
    } //if(permsRecieved) {
    //smList.show();


}//var ShowAvailableSocialMediaIcons = function () { 

var greyedIcon = function (icon) {
    if (icon) {
        var sm_name = $(icon).attr('id');
        //var permissions = getJSONNode(getConnectedSocialMedia, getConnectedSocialMedia.id, sm_name); 
        //if (getConnectedSocialMedia) {

            //$(icon).attr('-webkit-filter', 'grayscale(1)');
            $(icon).attr('filter', 'gray');
            $(icon).attr('filter', 'grayscale(1)');
        //}
    } //if (icon) { 
}//var greyedIcons= function(icon) {

var iconClick = function (e, socialMedia) { //var iconValue = ['facebook', 'twitter', 'googlePlusUser', 'instagram', 'linkedin', 'tumblr'];
    if (socialMedia) {
        switch (socialMedia) {
            case iconValue[0]:
                $executeFacebookCommand({ scope: "user_managed_groups" }, '/me/groups', function (groupResponse) {
                    
                    var email = $getClientEmail();
                    var groupsData = { userId: email, 'sm_name': 'facebook', data: { type: 'groups_data', 'data': groupResponse } };
                    $setCredsToServer(groupsData, function (permsStatus) {
                        manageServerResponse(permsStatus);
                        $executeFacebookCommand({ scope: "manage_pages, pages_show_list" }, '/me/accounts', function (pageResponse) {
                            var email = $getClientEmail();
                            var pagesData = { userId: email, 'sm_name': 'facebook', data: { type: 'page_data', 'data': pageResponse } };
                            $setCredsToServer(pagesData, function (permsStatus) {
                                manageServerResponse(permsStatus);
                            });//$setCredsToServer(permsData, function (permsStatus) {

                        });//$executeFacebookCommand('/me/acccounts', function (memberResponse) {

                    });//$setCredsToServer(permsData, function (permsStatus) {


                });//$executeFacebookCommMand('/me/groups', function (response) { 
                break;
                // call facebook connect with permission to publish
                // manage page
                // manage groups
                // fill data for profile
                //break;
            case iconValue[1]:
                var command = $twitterUrls.lists
                $nectorrTwitterExecCommand(command, function (data) {
                    //save lists to database
                    var email = $getClientEmail();
                    var listsData = { userId: email, 'sm_name': 'facebook', data: { type: 'lists_data', 'data': data } };
                    $setCredsToServer(listsData, function (permsStatus) {
                        manageServerResponse(permsStatus);
                    });
                });
                // get permissions for read and write on twitter
                // get permission to access list
                // get permission to send posts to users

                break;
            case iconValue[2]:// 
                // get permission to read and write
                // get permissions to write in managed and other groups

                break;
            case iconValue[3]:
                // get permissions for google plus users
                // get permission to read and write to circles
                
                break;
            case iconValue[4]:
                // get permissions to manage instagram friends and groups
                // get permission to read and write to instagram
                $nectorrLinkedInLogin('', 'event', function (data) {

                    IN.API.Raw("/people/~/group-memberships:(group:(id,name))?membership-state=member").result(function (data) {
                        var a = data
                    }).error(function (data) {
                        var a = data
                    });
                
                });
                break;
            case iconValue[5]:
                // get permissions to read boards
                // get permissions to srite to boards
                // get permission to post 

                break;
            //case iconValue[6]:
            default:
        }//switch (socialMedia) {
    }//if (socialMedia) {
} //var iconClick = function (socialMedia) {

var getSocialMediaDetails = function (email) {
    var returnValue;
    if (email) {
        var creds = $getCredsFromServer(email, function (data) { 
                permsFromServer = JSON.parse(data.data);
                getConnectedSocialMedia = permsFromServer;
                return permsFromServer

        });
    }//if (email) { 
    //return returnValue;
}//var getSocialMediaDetails = function (signInId) { 

var getJSONNode = function (jsonClass, fieldName, value) {
    var returnValue;
        return jsonClass.filter(
        function (data) {
            if (data.fieldName == value) {
                returnValue =  data;
            }//if (data.fieldName == value) { 
            return returnValue;
        }//function (data) {
        ); //return jsonClass.filter(
}//var getJSONNode = function (getConnectedSocialMedia, value) {

var createBoostingProfile = function (param, callback) { }

var removeBaseUrl= function (url) {
    var returnValue = "";
    if (url) {
        var splitUrl = url.split("//");
        var http = splitUrl[0] + "//";
        var base = splitUrl[1].split("/");
        for (var counter = 1; counter < base.length; counter++){
            returnValue += '/'+base[counter];
        }
        //returnValue = base[1];
    }//if (url) {
    return returnValue;

}//var removeBaseUrl(function (url) {

var getBaseUrl = function (url) {
    var returnValue = "";
    if (url) {
        var splitUrl = url.split("//"); 
        var http = splitUrl[0] + "//";
        var base = splitUrl[1].split("/");
        returnValue = http + base[0];
    }//if (url) {
    return returnValue;
}

// old code R&D
//getPermsFromServer('facebook', function (creds) {
//    var a = creds;
//});//getPermsFromServer('facebook', function (creds) {


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
