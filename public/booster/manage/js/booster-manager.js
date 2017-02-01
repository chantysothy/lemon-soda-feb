var selectedOptions = [];

$(window).load(function (e) {
    $("#booster-option-tag-list").tagsinput();
}); //$(window).load(function () { 

$(document).ready(function () {


    $("select").msDropdown({ roundedBorder: true });
}); //$(document).ready(function () {

var getSelectedOptions = function () {
    var returnValue
    var selectedSocialMedia = $("#social-media").selected.value;

    return returnValue
}//var getSelectedOptions = functions(){
var checkDuplicateSelection = function (valueToCheck) {
    if (valueToCheck) {

    }//if (valueToCheck) {
} //var checkDuplicate = function (valueToCheck) {