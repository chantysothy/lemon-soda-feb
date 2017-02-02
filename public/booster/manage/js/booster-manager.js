var selectedOptions = [];
var tempSocialMediaNames = ['facebook','twitter','google'];//, 'google', 'twitter'];
var selectedPostableLocs ={};
$(window).load(function (e) {
    $("#booster-option-tag-list").tagsinput();
    var smElementCounter = 0;
    for (var smcounter = 0; smcounter < tempSocialMediaNames.length; smcounter++) {
        SocialMediaGroupsAndPages[tempSocialMediaNames[smcounter]].getPostableLocs(function (data) {
            var socialMediaName = tempSocialMediaNames[smElementCounter];//tempSocialMediaNames[smcounter];
            selectedPostableLocs[socialMediaName] = data;
            smElementCounter++
        });//SocialMediaGroupsAndPages[tempSocialMediaNames[smcounter]].getPostableLocs(function (data) {
    }//for (var smcounter = 0; smcounter < tempSocialMediaNames.length; smcounter++) {
}); //$(window).load(function () { 

$(document).ready(function () {
    initFacebookAPI();
    $('#options-add-to-list').click(function (e) {
        var optionToAdd = getSelectedOptions();
        // add as 
    });//$('#options-add-to-list').click(function (e) {

    $('#options-type-name').focus(function (e) {
        var selectedOptions = getSelectedOptions();
        var postableLocs = SocialMediaGroupsAndPages[selectedOptions.sm_name].getPostableLocs(function (postableLocations) {
            selectedPostableLocs = addElementToArray("", postableLocations);
        });
        
    });//$('#options-type-name').focus(function (e) {

    $("select").msDropdown({ roundedBorder: true });

}); //$(document).ready(function () {

var getSelectedOptions = function () {
    var returnValue
    var selectedSocialMedia = $("#social-media").val();
    var postableLoc = $("#tech").val();
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
        getPostableLocs: function ( callback) {
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
                                    , pages : []
                                
                            }
                            pushIntoArray(postableLocs.groups, response.data);
                            /* get pages*/
                            $executeFacebookCommand('manage_pages', '/' + user_id + '/accounts', function (pageData) {
                                pushIntoArray(postableLocs.pages, pageData.data);
                                if (callback) {
                                    callback(postableLocs);
                                } else {
                                    return postableLocs;
                                }
                            });
                        }//if (response && !response.error) {
                    } //function (response) {
                ); //FB.api("/" + user_id+"/groups",
            });//$nectorrFacebookLogin("", function (data) {
            
        }//getPostableLocs: function (userInfo) { 
    },//"facebook": {}
    "twitter": {
        screenName: "",
        getPostableLocs: function (callback) {
            $getTwitterLists(function (lists) {
                if (callback) { callback(lists) } else { callback(null) } 
            });

        } //getPostableLocs: function () {
    },//"twitter": {}
    "google": {
        userId: "",
        access_token: "",
        getPostableLocs: function ( callback) {
            $initializeGoogleAuth2(function (profileInfo) {
                var a = profileInfo
                
            });
        },
        getFeaturedCollections: function () { }
    },//"google": {}
    "instagram": {
        user_id: "",
        access_token: "",
        getPostableLocs: function (callback) {
        }
    }, //"instagram": {}
    "pinterest": {
        user_id: "",
        access_token: "",
        getPostableLocs: function () {

        }//getPostableLocs: function () {
    }, //pinterest
    "linkedin": {
        userId: "",
        access_token: "",
        getPostableLocs: function () {
        }//        getPostableLocs: function () {
    } //linkedIn

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