var mongoose = require('mongoose');
var schedulerTaskModel = require('../models/schedulerData.js');


var Scheduler = function Scheduler() {

    this._instance = null;
    this._task = null;
    this._taskHandle = null;
    this._started = false;

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

    this.execute = function () {
        // remove the first element of timeline
        var taskModel = this.findByHandle();
        // object = find handle
        this.findByHandle(function(taskObject) {
        // set status to complete
            taskObject.status = 2;
            taskObject.timeline = taskObject.timeline.splice(0, 1);
        // remove the first item from timeLine
        // setTask using object recieved from find handle

        });//this.findByHandle(function (taskObject) {
    };

    this.quickSort = function (arr, left, right) {
        var len = arr.length,
            pivot,
            partitionIndex;


        if (left < right) {
            pivot = right;
            partitionIndex = partition(arr, pivot, left, right);

            //sort left and right
            quickSort(arr, left, partitionIndex - 1);
            quickSort(arr, partitionIndex + 1, right);
        }
        return arr;
    }//function quickSort(arr, left, right)

    this.partition = function(arr, pivot, left, right) {
        var pivotValue = arr[pivot],
            partitionIndex = left;

        for (var i = left; i < right; i++) {
            if (arr[i] < pivotValue) {
                swap(arr, i, partitionIndex);
                partitionIndex++;
            }
        }//function partition(arr, pivot, left, right) {
        swap(arr, right, partitionIndex);
        return partitionIndex;
    }

    this.swap = function (arr, i, j) {
        var temp = arr[i];
        arr[i] = arr[j];
        arr[j] = temp;
    }

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
                        var timeline = task.timelines.timeline;
                        timeline = this.quickSort(timeline, 0, timeline.length);
//                        timeline = this.curateTimeLine(timeline);
//                        timeline = quicksort(timeline, 0, timeline.length);
//                        timeline = this.curateTimeLine(timeline);
                        if (timeline.length > 0) {
                            task.task.executeAt = timeline[0]
                            this._taskHandle = setTimeOut(this.execute(), task.task.executeAt);
                            task['taskHandle'] = this._taskHandle;
                        }
                        dbModel.task = task;
                        dbModel.save(function (err, doc, rows) {
                            if (err) {
                                console.log(err);
                                return;
                            }
                            if (doc) {

                            }//if (doc) {
                        });
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
        this.isRunning = false;
    }////this.SetTask = function (userId, task, params, callback) {

    this.startScheduler = function () {
        this.isRunning = true;
    }////this.SetTask = function (userId, task, params, callback) {

    this.restartScheduler = function () {
        this.stopScheduler();
        this.startScheduler();
    }////this.SetTask = function (userId, task, params, callback) {
    this.isRunning = function () {
        return this._started;
        //this.stopScheduler();
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
    this._instance._started = true;
    return this._instance;
}//Scheduler.getInstance(){



module.exports = Scheduler.getInstance();