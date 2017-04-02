 
var mongoose = require('mongoose');
var Scheduler = {
    email: String
    ,task: Object
    //, status: number
    //, schedule: []
    //, vignettes: []
    //, data: Object
    //, others: Object
    //, name: String
    //, comments: String
    //, deleted: Boolean
    //, dateTime: String
    //, error: Object
    //, parameters: Object
    //, executeAt: Date
}

var schedulerSchema = mongoose.Schema(Scheduler);

module.exports = mongoose.model('scheduler', schedulerSchema);