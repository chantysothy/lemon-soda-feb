// app/models/user.js
// load the things we need
var mongoose = require('mongoose');
mongoose.Promise = require('bluebird');
var bcrypt   = require('bcrypt-nodejs');

// define the schema for our user model
var userSchema = mongoose.Schema( {
    
    local            : {
        id: String
        , email        : String
        , password     : String
        , name : String
        , referredBy: String
    },
    facebook         : {
        id              : String
        , token         : String
        , email         : String
        , name          : String
        , posts         : Object
        , pageData      : Object
        , permsData     : String
        , groupsData    : Object
    },
    twitter: {
        profileInfo: Object
        , listInfo : Object
    },
    googlePlusUser           : {
        //id           : String
        //, token        : String
         email          : String
        , aboutMe       :String
        , circledByCount: Number
        , cover         : Object
        , displayName   : String
        , etag          : String
        , gender        : String
        , id            : String
        , image         : Object
        , isPlusUser    : Boolean
        , kind          : String
        , language      : String
        , name          : Object
        , objectType    : String
        , occupation    : String
        , organizations : Array
        , placesLived   : Array
        , result        : Object
        , url           : String
        , urls          : Array
        , verified      : Boolean
        , perms : { data : String, dontAsk : Boolean }
        , posts : Object
    },
    linkedin: {
        profileInfo: Object
        , pageInfo : Object
        , groupsInfo    : Object
    },
    instagram           : {
        id              : String
        , token         : String
        , email         : String
        , name          : String
        , perms         : { data : String, dontAsk : Boolean }
        , posts         : Object
    },
    vimeo              : {
        id             : String
        , token        : String
        , email        : String
        , name         : String
        , perms : { data : String, dontAsk : Boolean }
        , posts : Object
    },
    youtube            : {
        id              : String
        , token         :     String
        , email         : String
        , name          : String
        , perms         : { data : String, dontAsk : Boolean }
        , posts         : Object
    },
    pinterest           : {
        id              : String
        , token         : String
        , email         : String
        , name          : String
        , perms : { data : String, dontAsk : Boolean }
        , posts : Object
    },
    telegram           : {
        id             : String
        , token        : String
        , email        : String
        , name         : String
        , perms : { data : String, dontAsk : Boolean }
        , posts : Object
    },
    boostingProfiles: {
        data: {}
        /*
        * data to hold each boosting profile.
        each boosting profile to have the following field
        id : string
        element : {}
        element to have sm_name :string,
        type :  string 'page' group, list, circles,
        element_parameters: {} credentials, keys etc
        */
    }
});

// checking if password is valid using bcrypt
userSchema.methods.validPassword = function(password) {
    return bcrypt.compareSync(password, this.local.password);
};


// this method hashes the password and sets the users password
userSchema.methods.hashPassword = function(password) {
    var user = this;

    // hash the password
    bcrypt.hash(password, null, null, function(err, hash) {
        if (err)
            return next(err);

        user.local.password = hash;
    });

};

//user.Schema.methods.IsValidUserInDb = function (userid) {
//    var returnValue = false;
//    return returnValue;
//}
// create the model for users and expose it to our app

module.exports = mongoose.model('User', userSchema);
