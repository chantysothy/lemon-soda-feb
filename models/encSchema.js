var mongoose = require('mongoose');
var encryptSchema = mongoose.Schema({
    value   : String,
    key     : String,
    original: String
});
module.exports = mongoose.model('Encryptor', encryptSchema,'nectrr',false);
