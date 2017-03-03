var mongoose = require('mongoose');
var Scheduler = {
    email: String
    , completed: Boolean
    , schedule: []
    , vignettes: []
    , data: Object
    , others: Object
    , name: String
    , comments: String
    , deleted: Boolean
    , dateTime: String
    , error: Object
}

var schedulerSchema = mongoose.Schema(Scheduler);

module.exports = mongoose.model('scheduler', schedulerSchema);