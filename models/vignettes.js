var mongoose = require('mongoose');
var vignetteSchema = mongoose.Schema( {
    email : String 
    , data : Object 
});

module.exports = mongoose.model('vignette', vignetteSchema);
