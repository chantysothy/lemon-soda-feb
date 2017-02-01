var mongoose = require('mongoose');
var bcrypt = require('bcrypt-nodejs');
var invitationSchema = mongoose.Schema( {
    first_name : String 
    , email : String 
    , invitation_code : String 
    , invited_by: String 
    , invitationType : String //individual, corporate
    , invitation_left : Number
    , verified_code : String 
    , invitation_used : Boolean

});

module.exports = mongoose.model('invitation', invitationSchema);
