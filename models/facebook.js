var mongoose = require('mongoose');
var bcrypt = require('bcrypt-nodejs');


var FacebookPostSchema = mongoose.Schema({
    
    local            : {
        email        : String
        , password     : String
    }
});

var facebookImages = mongoose.Schema({
    
    local            : {
        email        : String
        , password     : String
    }
});

var FacebookVideo = mongoose.Schema({
    
    local            : {
        email        : String
        , password     : String
    }
});

var FacebookGroupPost = mongoose.Schema({
    
    local            : {
        email        : String
        , password     : String
    }
});

var FacebookGroup = mongoose.Schema({
    
    local            : {
        email        : String
        , password     : String
    }
});
var FacebookPage = mongoose.Schema({
    
    local            : {
        email        : String
        , password     : String
    }
});

var FacebookPagePost = mongoose.Schema({
    
    local            : {
        email        : String
        , password     : String
    }
});


var FacebookPagePost = mongoose.Schema({
    
    local            : {
        email        : String
        , password     : String
    }
});

module.exports = FacebookGroup, FacebookGroupPost, facebookImages, FacebookPagePost, FacebookPostSchema, FacebookVideo;

