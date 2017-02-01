var  $getJsonValues = function(jsonObj, key) {
    var objects = [];
    for (var i in jsonObj) {
        if (!jsonObj.hasOwnProperty(i)) continue;
        if (i == key) { 
            objects.push(jsonObj[i]);
        } else if (typeof jsonObj[i] == 'object') {
            objects = objects.concat($getJsonValues(jsonObj[i], key));
            
        } //if (typeof jsonObj[i] == 'object') {
    } //for (var i in jsonObj) {
    return objects;
}//function $getJsonValues(jsonObj, key) {

var $getJsonKeys = function (jsonObj, val) {
    var objects = [];
    for (var i in jsonObj) {
        if (!jsonObj.hasOwnProperty(i)) continue;
        if (obj[i] == val) {
            objects.push(i);
        } else  if (typeof jsonObj[i] == 'object') {
            objects = objects.concat($getJsonKeys(jsonObj[i], val));
        } //if (typeof jsonObj[i] == 'object') {
    } //for (var i in jsonObj) {
    return objects;
}//var getJsonKeys = function (jsonObj, val) {

var $getJsonObjects = function (JsonObj, key, val) {
    var objects = [];
    for (var i in obj) {
        if (!JsonObj.hasOwnProperty(i)) continue;
        if (typeof JsonObj[i] == 'object') {
            objects = objects.concat($getJsonObjects(JsonObj[i], key, val));
        } else
            //if key matches and value matches or if key matches and value is not passed (eliminating the case where key matches but passed value does not)
            if (i == key && obj[i] == val || i == key && val == '') { //
                objects.push(JsonObj);
            } else if (JsonObj[i] == val && key == '') {
                //only add if the object is not already in the array
                if (objects.lastIndexOf(JsonObj) == -1) {
                    objects.push(JsonObj);
                } //if (objects.lastIndexOf(JsonObj) == -1) {
            }//if (typeof JsonObj[i] == 'object') {
    } //for (var i in obj) {
    return objects;
} //var $getJsonObjects = function (JsonObj, key, val) {