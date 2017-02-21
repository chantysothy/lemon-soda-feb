var mongoose = require('mongoose');
var vignetteSchema = mongoose.Schema( {
    email: String 
    , vignette_name : String
    , data : Object 
});

module.exports = mongoose.model('vignette', vignetteSchema);
