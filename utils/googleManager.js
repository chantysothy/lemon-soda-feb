var googlePlusApi = require('googleapis');
var config = require('../config/config');


var GoogleManager = function () {

}//var GoogleManager = function () {

GoogleManager.prototype.uploadVideoToYouTube = function (params, callback) {

}//GoogleManager.prototype.uploadVideoToYouTube = function (params, callback) {

GoogleManager.prototype.postToGooglePlus = function (params, callback) {
    var plus = googlePlusApi('v1');

}//GoogleManager.prototype.postToGooglePlus = function (params, callback) {

module.exports = GoogleManager;