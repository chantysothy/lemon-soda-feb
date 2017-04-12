var mongoose = require('mongoose');
var mongooseLong = require('mongoose-long')(mongoose);
var mongooseFunction = require('mongoose-function')(mongoose);

var SchemaTypes = mongoose.Schema.Types;
var Long = mongoose.Types.Long;

var schedulerTaskModel = require('../models/schedulerData');
var emitter = require('events').EventEmitter;
var inherits = require('util').inherits;
var self;
var Itener = function () {
    this._instance = null;
    this._task = null;
    this._itenerHandle = null;
    this._started = false;
    this.partitionIndex = -1;
    this.TIMEOUT_TIME = 30 * 1000;
    //utils.inherits(this, events.EventEmitter);
    this.execute = function (callback) {
        var dbModel = schedulerTaskModel;
        var conditionTime = Date.now() + this.TIMEOUT_TIME ; 
        var condition = { "executeAt": { "$lte": conditionTime } };//{ "executeAt": { $gte: Date.now() }, $and: [ { "executeAt": { $lte: 1491816900000 } }
        dbModel.find(condition, function (err, docs) {
            if (err) {
                callback({ error: err });
                return;
            }
            if (docs) {
                for (var taskCounter = 0; taskCounter < docs.length; taskCounter++) {
                    var currentTask = docs[taskCounter];
                    callback(currentTask);
                }//for (var taskCounter = 0; taskCounter < docs.length; taskCounter++) {
            }//if (docs) {
        });
    }//var execute = function () {

    this.stopScheduler = function () {
        if (this._started) {
            if (this._itenerHandle) {
                clearInterval(this._itenerHandle);
                this._started = false;
            }//if (this._itenerHandle) {
        }//if (this._started) {
    }//this.stopScheduler = function () {
    this.startScheduler = function () {
        if (!this._started) {
            this._itenerHandle = setInterval(function () {
                self.execute(function (taskInfo) {
                    self.emit('Itener_TaskStart', [taskInfo]);
                });
            }, this.TIMEOUT_TIME);
            this._started = true;
        }
    }//this.startScheduler = function () {
    self = this;
}                                                                                              
//var self = this;
//Itener.prototype = new events.EventEmitter();

Itener.prototype.getInstance = function () {
    if (!this._instance)
        this._instance = new Itener();
    return this._instance;
}//Itener.prototype.getInstance = function () {

Itener.prototype.start = function () {
    this.startScheduler();
}//Itener.prototype.start = function () {

Itener.prototype.stop = function () {
    this.stopScheduler();
}//Itener.prototype.stop = function () {

Itener.prototype.isRunning = function () {
    return this._started;
}//Itener.prototype.isRunning = function () {

Itener.prototype.restart = function () {
    this.stopScheduler();
    this.startScheduler();
}//Itener.prototype.restart = function () {

Itener.prototype.schedule = function (userId, task, params) {//(userId, task, params, callback) {
    this.saveTask(userId, task, params);
}//Itener.prototype.schedule = function () {

var updateTasks = function (doc, callback) {

}//var updateTasks = function (docs) {

Itener.prototype.saveTask = function (userId, task, params, callback) {
    if (typeof task === 'object') {
        if (typeof params === 'object') {
            task['params'] = params;
            var dbModel = new schedulerTaskModel();
            dbModel.email = userId;
            var timeline = task.timeLine.timeline;
            //                        timeline = this.quickSort(timeline, 0, timeline.length-1);
            //                        timeline = this.curateTimeLine(timeline);
            //                        timeline = quicksort(timeline, 0, timeline.length);
            //                        timeline = this.curateTimeLine(timeline);
            if (timeline.length > 0) {
                dbModel['executeAt'] = Date.parse(timeline[0]);
                task.timeLine.timeline.splice(0, 1);
                dbModel.task = task;
                dbModel.save(function (err, doc, rows) {
                    if (err) {
                        callback({ 'Itener_Error': [{ error: err }]});
                        //emit();
                        //console.log(err);
                        return;
                    }
                    if (doc) {
                        self.emit('Itener_Task_Scheduled', { id: doc._id })
                    }//if (doc) {
                });
            }//if (executionTime > 0) {
        } else {
            //throw new Error("params is in incorrect format");
            self.emit('Itener_Error', [{ error: params }]);
        }//if (timeline.length > 0) {
    } else {
        //throw new Error("task is in incorrect format");
        self.emit('Itener_Error', [{ error: task }]);
    }

}
//emitter.call(this);
inherits(Itener, emitter);


module.exports = Itener;                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                            
