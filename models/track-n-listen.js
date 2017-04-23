var mongoose = require('mongoose');
mongoose.Promise = require('bluebird');

var ConfigurationSchema = mongoose.Schema({
    "user_id" : String
    , "StreamObject" : Object

}); //var TrackNListenSchema = mongoose.Schema({

//mongoose.model(TrackNListenSchema
module.exports = mongoose.model("Configuration", ConfigurationSchema,"UserConfigs",false);
