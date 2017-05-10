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
    facebook: { profileInfo: {}, postableLocs: {}},
    twitter: { profileInfo: {}, postableLocs: {}},
    googlePlusUser: { profileInfo: {}, postableLocs: {}},
    google: { profileInfo: {}, postableLocs: {}},
    linkedin: { profileInfo: {}, postableLocs: {}},
    instagram: { profileInfo: {}, postableLocs: {}},
    vimeo: { profileInfo: {}, postableLocs: {}},
    youtube: { profileInfo: {}, postableLocs: {}},
    pinterest: { profileInfo: {}, postableLocs: {}},
    telegram: { profileInfo: {}, postableLocs: {}}
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

module.exports = mongoose.model("users", userSchema);
