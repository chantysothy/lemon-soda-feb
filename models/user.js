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
        , permsData     : String
        , postableLocs: Object
    },
    twitter: {
        profileInfo: Object
        , postableLocs : Object
    },
    googlePlusUser: {
        profileInfo: Object
        , postableLoc : Object
    },
    linkedin: {
        profileInfo: Object
        , postableLocs    : Object
    },
    instagram           : {
        id              : String
        , token         : String
        , email         : String
        , name          : String
        , perms         : { data : String, dontAsk : Boolean }
        , posts: Object
        , postableLocs : Object
    },
    vimeo              : {
        id             : String
        , token        : String
        , email        : String
        , name         : String
        , perms : { data : String, dontAsk : Boolean }
        , posts: Object
        , postableLocs : Object
    },
    youtube            : {
        id              : String
        , token         :     String
        , email         : String
        , name          : String
        , perms         : { data : String, dontAsk : Boolean }
        , posts: Object
        , postableLocs: Object
    },
    pinterest           : {
        id              : String
        , token         : String
        , email         : String
        , name          : String
        , perms : { data : String, dontAsk : Boolean }
        , posts: Object
        , postableLocs : Object
    },
    telegram           : {
        id             : String
        , token        : String
        , email        : String
        , name         : String
        , perms : { data : String, dontAsk : Boolean }
        , posts: Object
        , postableLocs: Object
    },
    vignettes: {
        data: Object
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
