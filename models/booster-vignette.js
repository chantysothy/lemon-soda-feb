var mongoose = require('mongoose');
var vignette = {
    vignette_name: String
    , user_id: String
    , socialMedia: Object
    , timelines: Object
    , reBoosted: boolean
    , numReboosted: Number//individual, corporate

}

var vignetteSchema = mongoose.Schema(vignette);

module.exports = mongoose.model('boosterVignette', vignetteSchema);
