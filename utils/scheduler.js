var mongoose = require('mongoose');
var mongooseLong= require('mongoose-long')(mongoose);
var mongooseFunction=require('mongoose-function')(mongoose);

var SchemaTypes = mongoose.Schema.Types;
var Long = mongoose.Types.Long;

var schedulerTaskModel = require('../models/schedulerData.js');


var Scheduler = function Scheduler() {

    this._instance = null;
    this._task = null;
    this._taskHandle = null;
    this._started = false;
    this.partitionIndex = -1;
    this.findByHandle = function (callback) {
        var condition = { taskHandle: this._taskHandle };

        schedulerTaskModel.find(condition, function (err, doc) {
            if (err) {
                console.log(err);
                return;
            }//if (err) {
            if (doc) {
                if (callback)
                    callback(doc);
            }//if (doc) {
        });//schedulerTaskModel.find(condition, function (err, doc) {
    }//this.findByHandle = function () {
    var self = this;
    this.execute = function () {
        // remove the first element of timeline
        var taskModel = this.findByHandle();
        // object = find handle
        this.findByHandle(function(taskObject) {
        // set status to complete
            taskObject.status = 2;
            //taskObject.timeline = taskObject.timeline.splice(0, 1);
        // remove the first item from timeLine
        // setTask using object recieved from find handle

        });//this.findByHandle(function (taskObject) {
    };


    this.curateTimeLine = function (timeline) {
        var timeNow = Date.now();
        timeline.forEach(function (item, index) {
            if (timeNow > item) {
                timeline.splice(index, 1);
            }
        });
        return timeline;
    }

    this.setTask = function (userId, task, params, callback) {
        //set this.executeAt
        if (this._started)
            if (typeof task === 'object') {
                if (typeof params === 'object') {
                    task['params'] = params;
                    if (typeof callback === 'function') {
                        task['callback'] = callback;
                        var dbModel = new schedulerTaskModel();
                        dbModel.email = userId;
                        var timeline = task.timelines;
//                        timeline = this.quickSort(timeline, 0, timeline.length-1);
//                        timeline = this.curateTimeLine(timeline);
//                        timeline = quicksort(timeline, 0, timeline.length);
//                        timeline = this.curateTimeLine(timeline);
                        if (timeline.length > 0) {
                            task['executeAt'] = Date.parse(timeline[0]);
                            var executionTime = Long.fromString(task.executeAt) - Date.now();
                            if (executionTime > 0) {
                                this._taskHandle = setTimeout(function () {
                                    this.execute();
                                }, executionTime);
                                task['taskHandle'] = this._taskHandle;
                                dbModel.task = task;
                                dbModel.save(function (err, doc, rows) {
                                    if (err) {
                                        console.log(err);
                                        return;
                                    }
                                    if (doc) {

                                    }//if (doc) {
                                });
                            }//if (executionTime > 0) {
                        }//if (timeline.length > 0) {
                    } else {
                        throw new Error("callback is in incorrect format.");
                    }
                } else {
                    throw new Error("params is in incorrect format");
                }
            }
            else {
                throw new Error("task parameter is in incorrect format.");
            }
    };//this.SetTask = function (userId, task, params, callback) {

    this.removeTask = function (task) {
        if (this._taskHandle) {
            this.clearTimeOut(this._taskHandle);
            // update database field Status

        } else {
            throw new Error("No tasks in the schedule to remove.");
        }
    };

    this.stopScheduler = function () {
        if (this._taskHandle)
            clearTimeout(this._taskHandle);
        this._started = false;
    }////this.SetTask = function (userId, task, params, callback) {

    this.startScheduler = function () {
        this.isRunning = true;
        this._taskHandle = setInterval(
            function () {
                self.executeNow();
                //this.executeNow()
            }, 30000);
    }////this.SetTask = function (userId, task, params, callback) {


    this.restartScheduler = function () {
        this.stopScheduler();
        this.startScheduler();
    }////this.SetTask = function (userId, task, params, callback) {
    this.isRunning = function () {
        return this._started;
        //this.stopScheduler();
    }

    this.executeNow = function () {
        var EXECUTE_AT = Date.now() + (5 * 60 * 1000);
        var TASK_COMPLETE = "COMPLETE"; TASK_EXECUTED = "EXECUTED";
        var condition = { "executeAt": { $gte: Date.now() }, $and: [{ "executeAt": { $lte: EXECUTE_AT } }] }//{ 'executeAt': { '$lte': EXECUTE_AT, '$gt': Date.now() } };//, 'status': { '$exists' : false }}; // 
        schedulerTaskModel.find(condition, function (err, docs) {
            if (err) {
                throw new Error("StartSchedulerFindError : " + err.message);
                //return;
            }//if (err) {

            if (docs.length>0) {
                // add the first 100 records from the result set in ascending
                for (var taskCounter = 0; taskCounter < docs.length; taskCounter++) {
                    var taskInfo = docs[taskCounter].task;
                    if (!docs[taskCounter]['status']) {
                        docs[taskCounter]['status'] = TASK_EXECUTED;
                        var callbackForScheduler = docs[taskCounter]['callback'];
                        docs[taskCounter].save(function (err, docs) {
                            if (err) {
                                throw new Error("ERROR WHILE UPDATING TASK STATUS. ERROR DETAILS - " + JSON.stringify(err));
                            }
                        });
                        var timeForExecution = docs[taskCounter].executeAt - Date.now();
                        this._taskHandle = setTimeout(function () {
                            try {
                        //var callbackForScheduler = docs[taskCounter]['callback'];
                                var callback = eval(callbackForScheduler);//(null, taskInfo);//var schedulerCallback = function (error, taskInfo, params)
                                //this.prototype.callback = callback;
                                //this.prototype.callback(null,taskInfo,null);
                                var tmpCallback = new Object();
                                tmpCallback['callback'] = callback;
                                tmpCallback.callback(null, null, null);
                                docs[taskCounter]['status'] = TASK_COMPLETE;
                                //update executeAt with the next value in array
                                docs[taskCounter].save(function (err, docs) {
                                    if (err) {
                                        throw new Error("ERROR WHILE UPDATING TASK STATUS. ERROR DETAILS - " + JSON.stringify(err));
                                    }//if (err) {
                                });//docs[taskCounter].save(function (err, docs) {
                            } catch (err) {
                                console.log("Scheduler error at : " + taskInfo._id + ". Error = " + err)
                            }
                        }, timeForExecution);//setTimeout(function () {
                    }//if (docs[taskCounter]['status']) {
                }//for (var taskCounter = 0; taskCounter < docs.length; taskCounter++) {
                // set timeout
            }//if (doc) {
        });
    }
    //this.startScheduler();
}//var Scheduler = function Scheduler() {
//====SINGLETON CLASS DEFINITION=====================================

Scheduler.stop = function () {

}//Scheduler.stop = function () {

Scheduler.restart = function () {
}////Scheduler.stop = function () {

Scheduler.isRunning = function () {
    return this._started;
}

Scheduler.addTask = function (userId, task, params, callback) {
    this.setTask(userId, task, params, function (taskParam) {
        callback(taskParam);
        this.restartScheduler();
    });//this.setTask(userId, task, params, function (taskParam) {
};

Scheduler.start = function () {
    if (!this._started) {
        // get the first
    } else {
        throw new Error("Scheduler is running. Stop the scheduler to start again.");
    }
}//Scheduler.start = function () {

Scheduler.getInstance = function () {
    if (this._instance == null) {
        this._instance = new Scheduler();
    }//if (this._instance== null){
    this._instance.startScheduler();
    this._instance._started = true;
    return this._instance;
}//Scheduler.getInstance(){



module.exports = Scheduler.getInstance();