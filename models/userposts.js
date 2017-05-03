var mongoose = require('mongoose');
var postsSchema = mongoose.Schema({
    email: String
    , postData: Object
    , detailedPostData: Object
    , schedule: Object
    , repostInfo: Object
    , postIdOnSocialMedia: Object
    , executedSchedule: Array
});

module.exports = mongoose.model('user-posts', postsSchema);