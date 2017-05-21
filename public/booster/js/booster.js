var uploadedFiles = [], uploadedVideos = [];
var boostingProfile, selectVignette, postNowVignette;
var getConnectedSocialMedia;
var twitterScope, googlePlusScope, linkedInScope, instagramScope 
var iconUrl = ['../img/social/facebook-64.png', '../img/social/twitter-64.png', '../img/social/google-plus-64.png', '../img/social/instagram-64.png', '../img/social/linkedin-64.png', '../img/social/tumblr-64.png'];// Array
var iconValue = ['facebook', 'twitter', 'googlePlusUser', 'instagram', 'linkedin', 'tumblr'];
var selectedSocialMediaList = $('#selectedSocialMediaList');
var boostingResources = [];    
var slideIndex = -1;
var imageList=[];
var originalUrl, shortUrlForServer, imageUrlForServer, headingForServer, textForServer
$(window).load(function (e) {
    $('#currentImg').height(250).width(470);
    //$('#boosterPreview').left();
    $('#boosterPreview').height('auto');
    //getAccessTokens();
    $("#preloader").fadeOut("fast");
    $("#preloader").hide();


    //$('#imageHolder').append();
    //ShowAvailableSocialMediaIcons();//
}); //$(window).load(function () { 
window.closeSelectModal = function () {
    $('#selectVignette').modal('hide');
};
window.closeManageModal = function () {
    $('#manageVignette').modal('hide');
};
$(document).ready(function () {
    $("#imgNext").hide();
    $("#imgPrevious").hide();

    Dropzone.options.uploadWidget = {
        paramName: 'file',
        maxFilesize: 50, // MB
        videoFileSize : 100,
        maxFiles: 1,
        addRemoveLinks: true,
        dictDefaultMessage: 'Click to add photos or videos to your post.',
        dictResponseError: 'nectorr server is not responding.',
        autoProcessQueue : true,
        clickable: true,
        acceptedFiles: 'video/*, .mp4, .mov, .wmv, image/*',
        otherFilesPreviewFile: '../../images/other-icon.png',
        videoPreviewFile: '../../images/video-icon.png',
        imagePreviewFile: '../../images/image-icon.png', 
        init: function () {
            this.options.dictRemoveFile = "Remove";
            this.options.maxFilesize = 100;
            this.options.maxThumbnailFilesize = 10;
            //New file added
            this.on("addedfile", function (file) {
                $('#serverResponse').hide();
                console.log('new file added ', file);

            });
            // remove file starts
            this.on("maxfilesexceeded", function (file) {
                //alert("No more files please!");
                manageServerResponse({status: "ERROR",message : "No more files please!"});
                this.removeFile(file);
            });// remove file starts
 
            this.on("removedfile", function (file) {
                $.ajax({
                    headers: { "Accept": "application/json" }
                    , type: 'GET'
                    , url: '/upload/delete'
                    , data: "file=" + file.serverFileName
                    , dataType: "jsonp"
                    , jsonp: "callback"
                    , crossDomain: true
                    , beforeSend: function (xhr) {
                        xhr.withCredentials = true;
                    }
                    , jsonPCallback: "jsonpCallback"
                    , success: function (data) {
                        //var elementList = $(html).find(element);
                        manageServerResponse(data);
                    }//success: function (data) {
                    , error: function (jqXHR, textStatus, errorThrown) {
                        //var msgBox = $('#butrfly-login').find();
                        alert("ERROR: " + textStatus + "DETAILS: " + errorThrown);
                    }//error: function (jqXHR, textStatus, errorThrown) {
                });

            });
            // Send file starts

            this.on("sending", function (file, xhr, formData) {
                formData.append('fileName', JSON.stringify({ originalName: file.name }));
                formData.append('fileDetails', JSON.stringify(file));
                formData.append('email', $getClientEmail());
                console.log('upload started', file);
                //$('.meter').show();
            });

            this.on("totaluploadprogress", function (progress) {
                console.log("progress ", progress);
                //$('.roller').width(progress + '%');
            });

            this.on("queuecomplete", function (progress) {
                //$('.meter').delay(999).slideUp(999);
                console.log("Queue complete ", progress);
            });

            // On removing file
            this.on('success', function (file, resp) {
                var img = $("currentImg");
                console.log(file);
                console.log(resp);
                var response = JSON.parse(resp);
                var serverInfo = absolutePath(response.data.urlToPublish);
                file['me'] = serverInfo;
                file['urlForPublishing'] = serverInfo;
                var img = $("#currentImg")
                
                if (file.type == 'video/mp4') {
                    $("#currentImg").attr("src", "../images/video-poster.jpg");
                    uploadedVideos = [];
                    uploadedVideos.push(serverInfo);
                    //getVideoPoster(serverInfo, function (image) {
                    //    if (image) {
                    //        saveImageFromBlob(image, function (file) {
                    //            if (file.status == "SUCCESS") {
                    //                imageList.push(file.data);
                    //                $("currentImg").src = file.data;
                    //                uploadedVideos = [];
                    //                uploadedVideos.push(serverInfo);
                    //            }
                    //            plusDivs(slideIndex);
                    //        });//saveImageFromBlob(image, function (data) {
                    //        //img.attr('src', imageList[slideIndex]);
                    //    } else {
                    //        //display error
                    //    }
                    //});//imageList.push(getVideoPoster(serverInfo), function (image) {
                    //$('#boosterPreview').show();

                } else {
                    imageList.push(serverInfo);
                    slideIndex = imageList.length - 1;
                    plusDivs(slideIndex);

                    //img.attr('src', imageList[slideIndex]);
                    imageUrlForServer = serverInfo
                }//if (file.type == 'video/mp4') {

                $('#boosterPreview').show();
                $('#buttonPanel').show();

            });
            this.on('sendingmultiple', function (data, xhr, formData) {

            });//this.on('sendingmultiple', function (data, xhr, formData) {

            this.on('thumbnail', function (file) {
                if (file.type == "image/jpeg" || file.type == "image/png") {
                    //if (file.width < 250 || file.height < 250) {
                    //    file.rejectDimensions();
                    //} else {
                        file.acceptDimensions();
                    //}
                } else if ((file.type == 'video/mp4') || (file.type == 'video/mp4') || (file.type == 'video/quicktime') || (file.type == 'video/x-ms-wmv') || (file.type == 'video/x-msvideo')) {
                    if (file.size < 100 * 1024 * 1024) {
                        file.acceptDimensions();
                    } else {
                        file.rejectDimensions();
                    }
                } else {
                    file.rejectDimensions();
                }
            });
        },
        accept: function (file, done) {
            file.acceptDimensions = done;
            file.rejectDimensions = function () {
                if (file.type != "image/jpeg" && file.type != "image/png") {
                    done('only jpeg and png files supported by nectorr.')
                    return;
                } else if ((file.type != 'video/mp4') || (file.type != 'video/quicktime') || (file.type != 'video/x-ms-wmv') || (file.type = 'video/x-msvideo')) {
                    done('Invalid video format or size exceed 100 mb.')
                    return;
                } else {
                    done('file format/multiple files not supported by nectorr.');
                    return;
                }//if (file.type != "image/jpeg" && file.type != "image/ png") {
            };
            uploadedFiles.push({ fileDetails: file });
        }
    }; //Dropzone.options.uploadWidget = {
    

    $('#boosterPreview').hide();
    $('#buttonPanel').hide();
    //$('#boosterTextArea').keypress(function (e) {

    //    $('#boosterTextArea').markRegExp(/([@]|[#])([a-z])\w+/gmi);
    //});

    //$nectorrFacebookLogin(facebookDefaults.scope, null, function (fbResponse) {
    //    console.log(fbResponse);    
    //});
    $("#postNowVignette").animatedModal({
        modalTarget: 'postNowVignetteModal',
        animatedIn: 'fadeIn',
        animatedOut: 'fadeOut',
        animationDuration: '0.7s',
        color: 'rgba(51,51,51,0.9)',
        //color:'#3498db',
        // Callbacks
        beforeOpen: function () {
            console.log("The postNowVignetteModal animation before open was called");
        },
        afterOpen: function () {
            console.log("The animat postNowVignetteModal ion after open is completed");
        },
        beforeClose: function () {
            console.log("The postNowVignetteModal animation before close was called");
        },
        afterClose: function () {
            console.log("The postNowVignetteModal animation after close is completed");
        }
    });
    selectVignette = $("#selectVignette").animatedModal({
        modalTarget: 'selectVignetteModal',
        animatedIn: 'fadeIn',
        animatedOut: 'fadeOut',
        animationDuration: '0.7s',
        color: 'rgba(51,51,51,0.9)',
        //color:'#3498db',
        // Callbacks
        beforeOpen: function () {
            var src = $("#iFrameSettings").attr('src');
            $("#iFrameSelectVignette").attr("src", "./select/index.html");

            console.log("The selectVignetteModal animation before open was called");
        },
        afterOpen: function () {
            console.log("The animat selectVignetteModal ion after open is completed");
        },
        beforeClose: function () {
            console.log("The selectVignetteModal animation before close was called");
            setTimeout(settingIframeSrc("#iFramePostNow", ""), 5);
        },
        afterClose: function () {
            console.log("The selectVignetteModal animation after close is completed");
        }
    });

    $('#imgNext').click(function (e) {
        plusDivs(slideIndex);
    });//$('#imgPrevious').click(function (e) {
    $('#imgPrevious').click(function (e) {
        minusDivs(slideIndex);
    });//$('#imgPrevious').click(function (e) {

    $("#manageVignette").animatedModal({
        modalTarget: 'manageVignetteModal',
        animatedIn: 'fadeIn',
        animatedOut: 'fadeOut',
        animationDuration: '0.7s',
        color: 'rgba(51,51,51,0.9)',
        //color:'#3498db',
        // Callbacks
        beforeOpen: function () {
            $("#iFrameManageVignette").attr("src" , "./manage/index.html");
            console.log("The animation before open was called");
        },
        afterOpen: function () {
            console.log("The animation after open is completed");
        },
        beforeClose: function () {
            console.log("The animation before close was called");
        },
        afterClose: function () {
            console.log("The animation after close is completed");
        }
    });

    $("#boosterTextArea").focusout(function () {
        var postText = $(this).val();
        if (postText != '') {
            $("#boosterPreview").show();
            linkify(postText, function (extractedUrl) {
                postText = postText.replace(extractedUrl, "");
                $('#paraText').text(postText);
                textForServer = postText;
                //$('#paraText').()
            });//linkify(postText, function (extractedUrl) {
            $('#paraText').text(postText);
            $('#buttonPanel').show();
        }
    });//$("#boosterTextArea").focusout(function () {

    $("#postHeadingArea").focusout(function () {
        var headingText = $(this).val();
        if (headingText && (headingText != "")) {

            $("#boosterPreview").show();
            $("#h1Text").text("");
            $("#h1Text").hide().show(0);
            $("#h1Text").text(headingText);
            headingForServer = headingText;
            $('#buttonPanel').show();
        }//if (headingText && (headingText != "")) {
    });//$("#postHeadingArea").focusout(function () {

    $('#boosterTextArea').bind("paste", function (e) {
        boosterText = $(this).val();
        $('#serverResponse').hide();
//        $('#preloader').fadeIn('fast');
        var pastedData = e.originalEvent.clipboardData.getData('text');
        //, , imageUrlForServer, headingForServer, textForServer
        //$('#boosterTextArea').val(pastedData);
        // preview pane
        //var baseUrl = getBaseUrl(pastedData); original
        //initializeGoogle(true, function (googleResponse) {
        //    if (googleResponse){
                linkify(pastedData,function (extractedUrl) {
                shortenUrl(extractedUrl.url, function (data) {
                    if (data.shortUrl) {
                        var shortUrl = data.shortUrl;
                        shortUrlForServer = shortUrl; //used for server comm
                        var postData = pastedData;
                        postData = postData.replace(extractedUrl.url, shortUrl + "\n");
                        var hashTags = hashify(postData);
                        textForServer = hashTags;
                        if (boosterText != "") {
                            postData = boosterText + " " + postData;
                        }
                        $('#boosterTextArea').val(postData);
                        $("#boosterPreview").attr("src", shortUrl);
                        // get list of images
                        getHTML(extractedUrl.url, function (html) {
                            var h1Data = html.h1Tags
                            $("#h1Text").text(h1Data[0]);
                            $("#postHeadingArea").text(h1Data[0]);

                            headingForServer = h1Data[0];

                            var paras = html.pTags;

                            var para = paras[0], strLen;

                            if (para) {
                                if (paras[0] || paras[0] == "") para = paras[1];
                                if (para.length > 97) { strLen = 97 } else { strLen = para.length - 1 }
                                    para = para.substr(0, strLen);
                                    para += '...';
                                    $('#paraText').text(para);
                                    $('#boosterTextArea').text(para);
                                    textForServer = para;
                            }//if (para) {
                            $('#upload-widget').fadeOut('slow');
                            $('#buttonPanel').show();
                            slideIndex = -1;
                            imageList.push(html.imgTags);
                            if (imageList.length > 0) {
                                $('boosterPreview').attr('src', imageList[0]);
                                $("#imgNext").show();
                                $("#imgPrevious").show();

                            } else {
                                imageList = html.imgTags;
                            }
                            //imageList = cleanImageList(imageList);
                            //imageList = $(parentDiv).children('img').map(function () { return $(this) }).get();
                            if (imageList) {
                                plusDivs(slideIndex);// display images
                                $('#boosterPreview').show();

                            }
                            //addImageListToDiv("", imageList);
                            //showDivs(slideIndex);

                        });
                    } else {
                        manageServerResponse({ status: "ERROR", message: "An error occured while shortening Url." });
                    } //if (data){
                });//shortenUrl(pastedData, function (data) {


                $('#preloader').hide()
                $('#boosterTextArea').markRegExp(/([@]|[#])([a-z])\w+/gmi);

            });
        //    }//if (googleResponse) {
        //}, googlePlusDefaults.scopes.urlShortnerAuth, 'urlShortner', 'v1');       

        //originalUrl = url;function
        // google shortner

    }); //$('booster')..bind("paste", function (e) {

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

var minusDivs = function (index) {
    //showDivs(slideIndex += n);
    if (slideIndex >= imageList.length) {
        slideIndex = 1;
    }
    slideIndex -= 1;
    var imgHTML = "<img src=\"" + imageList[index] + "\">";
    $("#currentImg").attr('src', imageList[index]);
    imageUrlForServer = imageList[index];
}//function plusDivs(n) {

var plusDivs= function (index) {
    //showDivs(slideIndex += n);
    if (slideIndex >= imageList.length) {
        slideIndex = -1;
    }
    slideIndex += 1;
        var imgHTML = "<img src=\"" + imageList[index] + "\">";
        $("#currentImg").attr('src',imageList[index]);
        imageUrlForServer = imageList[index];
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
    var urlReq = { host: a.hostname, path: a.pathname }//,uri:url }
    $.ajax({
        headers: { "Accept": "application/json" }
        , type: 'GET'
        , url: '/get/html'
        , data: "urlPath=" + url
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
                    callback(html);
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

var shortenUrl = function (longUrl, callback) {
    //gapi.client.init({
    //    apiKey: googlePlusDefaults.apiKey
    //    , clientId: googlePlusDefaults.clientId
    //    , scope: googlePlusDefaults.scopes.urlShortnerAuth
    //})
    gapi.client.setApiKey(googlePlusDefaults.apiKey); // not using the standard key using GooglePlusDefault variable due to tech issue. 
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

var hashify = function (text) {
    var returnValue = [];
    var tempArray = text.split(' ');
    for (var tagCounter = 0; tagCounter < tempArray.length; tagCounter++) {
        var element = tempArray[tagCounter];
        if (element.substring(0, 1) == "#") {
            returnValue.push(element);
        }//if (element.substring(0, 1) == "#") {
    }//for (var tagCounter = 0; tagCounter < tempArray.length; tagCounter++) {
    var returnValueString="";
    for (var ret_valCounter = 0; ret_valCounter < returnValue.length; ret_valCounter++) {
        returnValueString= returnValueString + returnValue[ret_valCounter] + " ";
    }//for (var ret_valCounter = 0; ret_valCounter < returnValue.length; ret_valCounter++) {
    return returnValueString;
}//var hashify = function (text) {

var linkify = function (text, callback) {
    var urlRegex = /(\b(https?|http|ftp|file):\/\/[-A-Z0-9+&@#\/%?=~_|!:,.;]*[-A-Z0-9+&@#\/%=~_|])/ig;
    return text.replace(urlRegex, function (url) {
        if (callback) {
            callback({"url": url });
        };
    });
}

var updateServerInfoToFileArray = function (serverInfo, action, callback) {
    if (typeof action == 'function') {
        action = callback;
        action = null;
    }

    var element = uploadedFiles.filter(filterArray(serverInfo,this));

    if (element) {
        switch (action) {
            case 'delete':
                removeFileFromServer(serverInfo, callback);
                // delete element
                break;
            case 'update':
                //callback({});
                break;

        }//switch (action) {

    }//if (element) {
//                uploadedFiles.push({fileDetails: file});

}//var updateServerInfoToFileArray = function (serverInfo, action, callback) {

var filterArray = function (fileName, element) {
        if (element.originalFileName == fileName) {
            return element;
        }//if (element.originalFileName == fileName) {
}//var filterArray = function (fileName) {

var removeFileFromServer = function (fileName, callback) {
                $.ajax({
                    type: 'POST',
                    url: 'upload/delete',
                    data: JSON.stringify({ id: fileName }),//, _token: $('#csrf-token').val() },
                    dataType: 'html',
                    success: function (data) {
                        var rep = JSON.parse(data);
                        if (callback) {
                            callback(rep);
                        } //if (callback) {
                    } //success: function (data) {
                });

}

var getFilePath = function (fileName, callback) {
    $.ajax({
        headers: { "Accept": "application/json" }
        , type: 'get'
        , url: '/upload/path'
        , data: "file=" + fileName
        , dataType: "jsonp"
        , jsonp: "callback"
        , crossDomain: true
        , beforeSend: function (xhr) {
            xhr.withCredentials = true;
        }
        , jsonPCallback: "jsonpCallback"
        , success: function (data) {
            //var elementList = $(html).find(element);
            if (callback)
                callback(data);
        }//success: function (data) {
        , error: function (jqXHR, textStatus, errorThrown) {
            //var msgBox = $('#butrfly-login').find();
            alert("ERROR: " + textStatus + "DETAILS: " + errorThrown);
        }//error: function (jqXHR, textStatus, errorThrown) {
    });


}//var getFilePath = function (file, callback) {

var absolutePath = function (href) {
    var link = document.createElement("a");
    link.href = href;
    var returnValue = (link.protocol + "//" + link.host + link.pathname + link.search + link.hash);
    // check if this link is in HTML, if so delete it.
    return returnValue;
}
var addHiddenFields = function (file) {
    $('<input>').attr({
        type: 'hidden',
        id: 'fileDetails',
        name: 'fileDetails',
        value: JSON.stringify(file)
    }).appendTo('upload-widget');

    $('<input>').attr({
        type: 'hidden',
        id: 'email',
        name: 'Email',
        value: $getClientEmail()
    }).appendTo('upload-widget');
}//var addHiddenFields = function () {
var settingIframeSrc = function (iframeName, fileName) {
    var iframe = $(iframeName);
    var s = fileName +"?ignore ="+Math.floor(Math.random() * 1000);;
    //var iframe1 = document.getElementById('iframe1');
    if (-1 == navigator.userAgent.indexOf("MSIE")) {
        iframe.attr("src", s);
    }
    else {
        iframe.attr("location", s);
    }
    
    //iframe.contentWindow.location.reload(true);
}//var settingIframeSrc = function (iframeName, fileName) {
var getVideoPoster = function (videoUrl,videoCallback) {
    //var file = videoUrl;
    getFileForBlob(videoUrl, function (file, callback) {
        var fileReader = new FileReader();
        fileReader.readAsArrayBuffer(file);
        var blob = new Blob([fileReader.result], { type: file.type });
        var url = URL.createObjectURL(blob);
        var video = document.createElement('video');
        //video.setAttribute('src', videoUrl);
        var snapImage = function () {
            //video = document.getElementsByTagName('video');
            var canvas = document.createElement('canvas');
            canvas.width = video.videoWidth;
            canvas.height = video.videoHeight;

            canvas.getContext('2d').drawImage(video, 0, 0, canvas.width, canvas.height);
            var image = canvas.toDataURL("image/png");
            var success = image.length > 0;
            if (success) {
                //videoCallback(image);
               
                URL.revokeObjectURL(url);
                if (videoCallback)
                    videoCallback(image);
            } else {
                if (callback) {
                    callback(null);
                }

            }//if (success) {
            return success;
        }//var snapImage = function () {image

        var timeupdate = function () {
            video.currentTime = 5;
            if (snapImage()) {
                video.removeEventListener('timeupdate', timeupdate);
            }
        }//var timeupdate = function () {

        video.addEventListener('loadeddata', function () {
            video.currentTime = 5;
            if (snapImage()) {
                video.removeEventListener('timeupdate', timeupdate);
            }
        });
        video.addEventListener('timeupdate', timeupdate);
        video.preload = 'auto';
        video.src = videoUrl;
        video.setAttribute('type', 'video/mp4;codecs="avc1.42E01E, mp4a.40.2"');
        video.setAttribute('crossorigin', 'anonymous');  
        // Load video in Safari / IE11
        video.muted = true;
        video.playsInline = true;
        video.autoplay = true;
        //video.load();
        var playPromise = video.play();
        if (playPromise !== undefined) {
            playPromise.then(function () {
                // Automatic playback started!
            }).catch(function (error) {
                // Automatic playback failed.
                // Show a UI element to let the user manually start playback.
            });
        }

    });
}//var getVideoPoster = function (videoUrl) {

var getFileForBlob = function (url, callback) {
    var request = new XMLHttpRequest();
    request.open('GET', url, true);
    request.responseType = 'blob';
    request.onload = function () {
        if (callback) {
            callback(request.response);
        }
//        var reader = new FileReader();
//        reader.readAsDataURL(request.response);
//        reader.onload = function (e) {
//            console.log('DataURL:', e.target.result);
//        };
    };
    request.send();
}
var saveImageFromBlob = function (blobToSave, callback) {
    //blobToSave = blobToSave.split(',')[1];
    blobToSave = blobToSave.replace(/^data:image\/\w+;base64,/, "");
    $.post('/upload/image',
        {
            email: $getClientEmail()
            , blob: blobToSave
            , 'file_type': 'png'
        },
        function (data, status) {
            if (callback)
                callback(data)
        });//$.post('/profile/save',


}
