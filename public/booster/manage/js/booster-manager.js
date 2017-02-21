var selectedOptions = [];
var autoCompleteList = [];
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
    $('#weekCalendar').weekCalendar({
        timeslotsPerHour: 4,
        height: function ($calendar) {
            return $(window).height() - $("h1").outerHeight();
        },
        eventRender: function (calEvent, $event) {
            if (calEvent.end.getTime() < new Date().getTime()) {
                $event.css("backgroundColor", "#aaa");
                $event.find(".time").css({ "backgroundColor": "#999", "border": "1px solid #888" });
            }
        },
        eventNew: function (calEvent, $event) {
            timeLines.push(calEvent);
            // displayMessage("<strong>Added event</strong><br/>Start: " + calEvent.start + "<br/>End: " + calEvent.end);
           // alert("You've added a new event. You would capture this event, add the logic for creating a new event with your own fields, data and whatever backend persistence you require.");
        },
        eventDrop: function (calEvent, $event) {
            displayMessage("<strong>Moved Event</strong><br/>Start: " + calEvent.start + "<br/>End: " + calEvent.end);
        },
        eventResize: function (calEvent, $event) {
            //set the font sizes here
            displayMessage("<strong>Resized Event</strong><br/>Start: " + calEvent.start + "<br/>End: " + calEvent.end);
        },
        eventClick: function (calEvent, $event) {
            displayMessage("<strong>Clicked Event</strong><br/>Start: " + calEvent.start + "<br/>End: " + calEvent.end);
        },
        eventMouseover: function (calEvent, $event) {
            displayMessage("<strong>Mouseover Event</strong><br/>Start: " + calEvent.start + "<br/>End: " + calEvent.end);
        },
        eventMouseout: function (calEvent, $event) {
            displayMessage("<strong>Mouseout Event</strong><br/>Start: " + calEvent.start + "<br/>End: " + calEvent.end);
        },
        noEvents: function () {
            displayMessage("There are no events for this week");
        },
        data: eventData
    });

    function displayMessage(message) {
        $("#message").html(message).fadeIn();
    }

    //$calendar.weekCalendar("refresh");

    var smElementCounter = 0;
    for (var smcounter = 0; smcounter < tempSocialMediaNames.length; smcounter++) {
        SocialMediaGroupsAndPages[tempSocialMediaNames[smcounter]].getPostableLocs(function (data) {
            if (data ) {
                SocialMediaGroupsAndPages[data.sm_name].postableLocs = data;
                setupAutoCompleteList(autoCompleteList, data.sm_name);
                smElementCounter++;
                if (smElementCounter == tempSocialMediaNames.length) {
                    // prepare List for auto complete
                    // setup auto complete list values
                    
                    $("#sm-options-type-name").magicsearch({
                        dataSource: autoCompleteList,
                        fields: ['sm_name', 'type', 'desc'],
                        format: '%sm_name% · %type% · %desc%',                    
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
                        multiField: 'desc',
                        multiStyle: {space:5},
                        maxItem: true,
                        noResult: 'no such postable location found.'
                    });
                    $("#sm-options-type-name").attr('data-id', 'id, desc');
                    //fillCombo('sm-options-type-name', autoCompleteList);
                    //var fbPostableLocs = SocialMediaGroupsAndPages.facebook.; // update it on save as well.
                    // save PostableLocs
                    //$('#options-type-name').redraw();
                    //setPostableLocs(selectedPostableLocs, function (message) {
                        //manageServerResponse(message);
                    //});
                }//if (smElementCounter == tempSocialMediaNames.length) {
            } //if (data) {
        });//SocialMediaGroupsAndPages[tempSocialMediaNames[smcounter]].getPostableLocs(function (data) {
    }//for (var smcounter = 0; smcounter < tempSocialMediaNames.length; smcounter++) {
}); //$(window).load(function () { 

$(document).ready(function () {
    initFacebookAPI();
    $("#divSetCalendar").hide();
    $("#btnLogin").click(function (e) {       
        e.stopPropagation();
        e.preventDefault();
        $("#container_demo").toggle("slide");
        $("#divSetCalendar").effect("slide");
    });
    $("#btnBack").click(function (e) {
        e.stopPropagation();
        e.preventDefault();
        $("#divSetCalendar").hide();
        $("#container_demo").toggle("slide");
    });
    $("#social-media").msDropdown({ roundedBorder: true });
    $("#postLoc").msDropdown({ roundedBorder: true });

    $('#outlookCalendar').show();

    $('#btnSave').click(function (e) {
        $(this).closest('.nectorr-message').remove();
        e.stopPropagation();
        e.preventDefault();
        var formValidationStatus = validateForm();
        if (!formValidationStatus.error) {
            saveVignette(function (message) {
                manageServerResponse(message);
            });
        } else {
            manageMultipleServerResponse({ errors: formValidationStatus.error }, true);
        }//if (!validateForm().error) {
        //e.preventDefault();
        e.stopPropagation();
        e.preventDefault();
    });//$('#btnSave').click(function (e) {
}); //$(document).ready(function () {

var getSelectedOptions = function () {
    var returnValue
    var selectedSocialMedia = $("#social-media").val();
    var postableLoc = $("#postLoc").val();
    returnValue = { sm_name: selectedSocialMedia, loc: postableLoc, locValue: "" };
    return returnValue
}//var getSelectedOptions = functions(){

var checkDuplicateSelection = function (valueToCheck) {
    if (valueToCheck) {

    }//if (valueToCheck) {
} //var checkDuplicate = function (valueToCheck) {

var SocialMediaGroupsAndPages = {
    "facebook": {
        userId: "",
        access_token: "",
        groups: Object,
        pages: Object,
        postableLocs  : Object,
        getPostableLocs: function (callback) {
            var returnValue = []; // calling function needs to look at returnValue.length>0 to proceed. This method shall run asynchronously.
            // get relevant scopes and login
            $nectorrFacebookLogin("user_managed_groups", null, function (data) {
                var returnValue = []
                var user_id = data.authResponse.userID;
                FB.api("/" + user_id + "/groups",
                    function (response) {
                        if (response && !response.error) {
                            var postableLocs = {
                                groups: []
                                , pages: []

                            }
                            pushIntoArray(postableLocs.groups, response.data);

                            /* get pages*/
                            $executeFacebookCommand('manage_pages', '/' + user_id + '/accounts', function (pageData) {
                                pushIntoArray(postableLocs.pages, pageData.data);
                                if (callback) {
                                    setPostableLocs(postableLocs, 'facebook', function (data) {
                                        if (data.status == "SUCCESS") {
                                            callback({ sm_name: "facebook", data: postableLocs });
                                        } else {
                                            manageServerResponse(data);
                                        }
                                    });
                                } else {
                                    //return postableLocs;
                                }
                            });
                        } else {
                            var message = { status: "ERROR", message: "ERROR while automatically updating Postable locations : " + JSON.stringify(response.error) }
                            manageServerResponse(message);
                        }//if (response && !response.error) {
                    } //function (response) {
                ); //FB.api("/" + user_id+"/groups",
            });//$nectorrFacebookLogin("", function (data) {
            
        }//getPostableLocs: function (userInfo) { 
    },//"facebook": {}
    "twitter": {
        Id: String,
        screenName: "",
        postableLocs: {},
        getPostableLocs: function (callback) {
            $getTwitterLists(function (lists) {
                //this.SocialMediaGroupsAndPages.twitter.postableLocs['lists'] = lists;
                setPostableLocs(lists, 'twitter', function (data) {
                    if (data.status == "ERROR") {
                        manageServerResponse(data)
                    } else {
                        if (callback) {
                            callback({ sm_name: 'twitter', data: lists })
                        }
                    }
                });
            });
        } //getPostableLocs: function () {
    },//"twitter": {}
    "google": {
        userId: "",
        access_token: "",
        postableLocs: {},
        getPostableLocs: function (callback) {
            //initializeGoogle(null);
            if (callback) {
                setTimeout(
                    getLoggedInUserDetails(function (userData) {
                        if (userData.status == "SUCCESS") {
                            getGoogleCircles(function (circleResponse) {
                                //process the list

                                postableLocs["circles"] = circleResponse;
                                setPostableLocs(circleResponse, 'googlePlusUser', function (data) {
                                    if (data.status == "SUCCESS") {
                                        callback({ sm_name: "google", data: circleResponse });
                                    } else {
                                        manageServerResponse(data);
                                    }
                                });//setPostableLocs(circleResponse, 'googlePlusUser', function (data) {
                                //});//getRequest('GET', plusDomain.getCircleList, function (listData) {
                            }, userData.googlePlusUser.id, "https://www.googleapis.com/plusDomains/v1/people/userId/circles");
                        } else {
                            manageServerResponse(userData);
                        } //if (userData.status == "SUCCESS") {
                }),200);//getLoggedInUserDetails(function (userData) {
            } //if (callback) {
            
        },
        getFeaturedCollections: function () { }
    },//"google": {}
    "instagram": {
        user_id: "",
        access_token: "",
        postableLocs: {},
        getPostableLocs: function (callback) {
        }
    }, //"instagram": {}
    "pinterest": {
        user_id: "",
        access_token: "",
        boards : Object,
        getPostableLocs: function () {

        }//getPostableLocs: function () {
    }, //pinterest
    "linkedin": {
        userId: "",
        access_token: "",
        postableLoc: Object,        
        getPostableLocs: function() {
            IN.API.Raw("/people/~/group-memberships:(group:(id,name,counts-by-category))?membership-state=member")
                .result(function (groups) {
                    var a = groups;
                })
                .error(function (error) {
                    var a = error;
                });

        }//        getPostableLocs: function () {
    }, //linkedIn
    "Utils": {
        prepareListForAutoSuggest: function () {
            var returnValue = [{status : "Not to be used."}];
            
            return returnValue;
        } //prepareListForAutoSuggest: function () {
    } //Utils
} //var SocialMediaGroupsAndPages = {

var pushIntoArray = function (toArray, fromArray) {
    for (var fromArrayCounter = 0; fromArrayCounter < fromArray.length; fromArrayCounter++){
        if (fromArray[fromArrayCounter]) {
            toArray.push(fromArray[fromArrayCounter]);
        }//if (fromArray[fromArrayCounter]) {
    } //for (var fromArrayCounter = 0; fromArrayCounter < fromArray.length, fromArrayCounter++){
    return toArray;
}//var pushIntoArray = function (toArray, fromArray) {

var prepareArrayForPostableLocs = function (type,result) {
    // sample record- { type: "page", pageInfo: data }
    var returnValue = [];
    for (var counter = 0; counter < result.length; counter++) {
        var record = { 'type': type, 'data' : result[counter] }
        returnValue.push(record);
    }//for (var counter = 0; counter < result.length; counter++) {
    return returnValue;
} //var prepareArrayForPostableLocs = function (result) {

var authenticateUsingCodebird = function (cb, callback) {
    // gets a request token
    var returnValue= []
    cb.__call(
        "oauth_requestToken",
        { oauth_callback: "oob" },
        function (reply, rate, err) {
            if (err) {
                callback({ status: "ERROR", message: "ERROR: "+err.error});
                return;
            }//if (err) {
            if (reply) {
                cb.setToken(reply.oauth_token, reply.oauth_token_secret);

                // gets the authorize screen URL
                cb.__call(
                    "oauth_authorize",
                    {},
                    function (auth_url) {
                        window.codebird_auth = window.open(auth_url);
                        // stores reply
                        callback(reply);
                    }//cb.__call(
                );//cb.__call(
            }//if (reply) {
        } //function (reply, rate, err) {
    );//cb.__call(
}//var authenticateUsingCodebird = function (cb, callback) { 

var addElementToArray = function (elementName, elementArray) {
    var returnValue = [];
    for (var counter = 0; counter < elementArray.length; counter++) {
        if (elementArray[counter].elementName)
            returnValue.push(elementArray[counter].elementName);
    }//for (var counter = 0; counter < elementArray.length; counter++) {
    return returnValue;
}//var addElementToArray = function (elementName, elementArray) {

var setupAutoCompleteList = function (valArr, smName) {
    var returnValue = valArr;
    var fbPostableLocs = SocialMediaGroupsAndPages.facebook.postableLocs;
    var twitterPostableLocs = SocialMediaGroupsAndPages.twitter.postableLocs;
    var googlePostableLocs = SocialMediaGroupsAndPages.google.postableLocs;
    if (smName == 'facebook') {
        pushArray(returnValue, getElementsFromLocObj("group", fbPostableLocs.data.groups, smName));
        pushArray(returnValue, getElementsFromLocObj("pages", fbPostableLocs.data.pages, smName));
    }
    if (smName == 'twitter') {
        pushArray(returnValue, getElementsFromLocObj("list", twitterPostableLocs.data.data, smName));
    }
    if (smName == 'google') {
        pushArray(returnValue, getElementsFromLocObj("circles", googlePostableLocs.data, smName));
    }
        //pushArray(returnValue, fbPostableLocs.data.pages);
//    pushArray(returnValue, GetFbpostableLoc(facebookPagesArray));

    return returnValue;
} //var setupAutoCompleteList = function () {

var getElementsFromLocObj = function (type, locArr,smName= "not-set") {
    returnValue = [];
    for (var counter = 0; counter < locArr.length; counter++) {
        var element = {};
        if (smName == 'facebook') {
            var currentElement = locArr[counter];
            if (type == 'pages') {
                element['id'] = returnValue.length;
                element['type'] = 'page';
                element['sm_name'] = smName;
                element['sm_id'] = currentElement.id;
                element['desc'] = currentElement.name;
                element['otherInfo'] = JSON.stringify({
                    'category': currentElement.category
                    , 'access_token': currentElement.access_token
                    , 'categoryList': currentElement.category.category_list
                    , 'permissions': currentElement.perms

                });//element['otherInfo'] = {
                returnValue.push(element);

            } else {

                element['id'] = returnValue.length;
                element['type'] = 'group';
                element['sm_name'] = smName;
                element['sm_id'] = currentElement.id;
                element['desc'] = currentElement.name;
                element['otherInfo'] = JSON.stringify({
                    'privacy': currentElement.privacy
                });//element['otherInfo'] = {
                returnValue.push(element);
            }//        if (type == 'pages') {
        } else if (smName =='twitter'){
            var currentElement = locArr[counter];

            element['id'] = returnValue.length;
            element['type'] = 'list';
            element['sm_name'] = smName;
            element['sm_id'] = currentElement.id;
            element['desc'] = currentElement.name;
            element['otherInfo'] = JSON.stringify(currentElement);
            returnValue.push(element);
        }
        else if (smName == 'google') {

        }
    }//for (var counter = 0; counter < locObj.length; counter++) {
    valArr = returnValue;
    return returnValue;
}//var getElementsFromLocObj = function (type, locObj) {

var fillCombo = function (comboId, dataList) {
    $.each(dataList, function (i, dataItem) {
        var valueString = dataItem.type + '~' + dataItem.sm_name + '~' + dataItem.sm_id;
        var optionData = new Option(dataItem.sm_name + " " + dataItem.type + ":" + dataItem.desc, valueString);
        optionData.innerHTML = dataItem.sm_name + ":" + dataItem.desc;
        document.getElementById(comboId).appendChild(optionData)
        //$('#' + comboId).append($('<option>', {
        //    value: valueString,
        //    text: dataItem.desc
        //}));
    });

}//var fillCombo = function (comboId, dataList) {
$.fn.redraw = function () {
    $(this).each(function () {
        var redraw = this.offsetHeight;
    });
};

var getVignette = function(){
    var returnValue;
    var selectedLocs = getPostableLocsForDB();
    return { vignette_name: $('#input-vignette-name').val(),locs: selectedLocs, timeline: timeLines }
}//var getVignette = function(vignetteObject, callback){

var getPostableLocsForDB = function () {
    var returnValue = [];
    var multiItems = $(".multi-item").map(function () {
        return "'" + this.outerHTML + "'";
    }).get().join().split(',');
    for (var divCounter = 0; divCounter < multiItems.length; divCounter++){
        var childItem = $(multiItems[divCounter]);
        var childText = childItem.attr('title');
        var childItemArray = childText.split('·');

        var elementId = childItem.attr('data-id');

        var vignettePostableLoc = { postableLocId: autoCompleteList[elementId], postableLocName: childItemArray[2], type: childItemArray[1], sm_name:childItemArray[0] };
        returnValue.push(vignettePostableLoc);

    }//for (var divCounter = 0; divCounter < childCounter; divCounter++){
    return returnValue;
}//var getPostableLos = function (divName) {

var getPostableElement = function (id) {
    return autoCompleteList[id];
}//var getPostableElement = function (id) {

var saveVignette = function (callback) {
    var vignetteToSave = getVignette();
    setsmDetailsForVignetteSave(autoCompleteList, vignetteToSave.locs);
    saveVignetteToDB(vignetteToSave.vignette_name, vignetteToSave, callback);
}//var saveVignette = function (callback) {

var validateForm = function () {
    var returnValue = {};
    returnValue['success'] = {};

    
    var vignetteName = $('#input-vignette-name').val();
    if (vignetteName != "") {
        //returnValue = {};
        // check in the database before adding this value
        returnValue.success[0] = { status: "SUCCESS", message: "Valid vignette name." }
    } else {
        if (!returnValue.error) returnValue['error'] = {}
        returnValue.error[0] = {status: "ERROR", message:"A vignette name should have a valid value.Give it a relevant name. Click on the back button."}
    }
    var postableLocsValue = $('#sm-options-type-name').val();

//    if (!postableLocsValue || postableLocsValue == "") {
    if (getPostableLocsForDB().length<=0){
        if (!returnValue.error) returnValue['error'] = {}
        returnValue.error[1] = { status: "ERROR", message: "Select one or more locations to post. Nectorr wont be able to schedule or post for you. Click on the back button." }
    } else {
        returnValue.success[1] = { status: "SUCCESS", message: "Postable locations validated successfully." }
    }//if (!postableLocsValue || postableLocsValue == "") {

    if (!timeLines || timeLines.length <= 0) {
        if (!returnValue.error) returnValue['error'] = {}
        returnValue.error[2] = { status: "ERROR", message:"A vignette is for automated post on behalf of you. Click on the calendar to set time." }
    } else {
        returnValue.success[2] = { status: "SUCCESS", message: "Timelines validated successfully." }
    }//if (!postableLocsValue || postableLocsValue == "") {

    return returnValue;
}//var validateForm = function () {

var manageMultipleServerResponse = function (data, multipleRecords = false) {
    
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
        var errorList = data.errors;
        var errorNo = 0;
        $.each(errorList, function (element) {
            var childDiv = document.createElement("div");
            var thisElement = errorList[errorNo.toString()];
            if (thisElement) {
                if (thisElement.status == 'ERROR') {
                    childDiv.style.cssText = 'background-color:rgba(243, 0, 0, 0.6);color: #ffffff ;margin-top:2px; margin-bottom-2px';
                    childDiv.addClass("nectorr-msg");
                } else if (thisElement.status == 'SUCCESS') {
                    childDiv.style.cssText = 'background-color:rgba(10, 185, 5, 0.6); color, #ffffff ;margin-top:2px; margin-bottom-2px';
                    childDiv.addClass("nectorr-msg");
                } //if (data.status == 'ERROR') {
                childDiv.innerHTML = thisElement.message;
                $(childDiv).appendTo(serverResponse);
                errorNo += 1;
            }
        });//$.each(errorList, function (element) {
    }//if (!multipleRecords) {
}//var manageServerResponse = function(data) {

var setsmDetailsForVignetteSave = function (masterList, selectedItems) {

    return  _.filter(masterList, function (val) {
        return _.some(this, function (val2) {
            return val2['postableLocId.sm_id'] === val['sm_id'];
        });//return _.some(this, function (val2) {
    }, selectedItems);//return
}//var setsmDetailsForVignetteSave = function (list, selectedItems) {

