﻿var mongoose = require('mongoose');
var postsSchema = mongoose.Schema({
    email: String
    , postData: Object
    , detailedPostData: Object
    , schedule: Object
    , repostInfo : Object
});

module.exports = mongoose.model('user-posts', postsSchema);