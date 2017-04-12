 
var mongoose = require('mongoose');
var mongooseLong = require('mongoose-long')(mongoose);
var SchemaTypes = mongoose.Schema.Types;
var Long = mongoose.Types.Long;
var mongooseFunction = require('mongoose-function')(mongoose);

var Scheduler = {
    email: String
    , task: Object
    , executeAt: SchemaTypes.Long
    , callback: Function
    , status: String 
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

module.exports = mongoose.model('native-scheduler', schedulerSchema);