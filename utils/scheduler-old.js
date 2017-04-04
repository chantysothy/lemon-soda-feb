var mongoose = require('mongoose');
var schedulerTaskModel = require('../models/schedulerData.js');

var Task = {
    status: Number
    , schedule: []
    , vignettes: []
    , data: Object
    , others: Object
    , name: String
    , comments: String
    , deleted: Boolean
    , dateTime: String
    , error: Object
    , parameters: Object
    , executeAt: Date
}

var Scheduler = function Scheduler() {
    var _scheduler
    var _taskHandle;
    var _task;
    var _schedulerOn = false;
    var _taskArray = [];
    var _timeOutElement;

    function Scheduler() {

    };//function Scheduler(){

    function CreateInstance() {
        if (!_scheduler) {
            _scheduler = new Scheduler();//this;//new Object("Scheduler Instance");//new Scheduler();
        }
        return _scheduler;
    }//function createInstance() {

    function Scheduler.prototype.ManageTask(userId, data) {
        if (_schedulerOn) {
            // email
            var schedulerTask = new schedulerTaskModel();
            var timeline = data.schedule;
            timeline = quicksort(timeline, 0, timeline.length);
            timeline = curateTimeLine(timeline);
            if (timeline.length > 0) {
                data.task.executeAt = timeline[0]
            }
            RestartScheduler();
        } else {
            throw new Error("Start scheduler to update database.");
        }//if (_schedulerOn) {
    }//function ManageDatabase(dbData) {
    function quickSort(arr, left, right) {
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

    function partition(arr, pivot, left, right) {
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

    function swap(arr, i, j) {
        var temp = arr[i];
        arr[i] = arr[j];
        arr[j] = temp;
    }

    function curateTimeLine(timeline) {
        var timeNow = Date.now();
        timeline.forEach(function (item, index) {
            if (timeNow > item) {
                timeline.splice(index, 1);
            }
        });
        return timeline;
    }

    function Execute(data) {
        if (_schedulerOn) {

        } else {
            throw new Error("Start scheduler to execute task.");
        }//if (_schedulerOn) {
    }//function Execute(data) {

    function Find(condition) {
        // sort by date default
    }//function getFromDatabase(condition) {

    function RestartScheduler() {
        if (_schedulerOn) {
            stopScheduler();
            startScheduler();
        } else {
            startScheduler();
        }//if (_schedulerOn) {
    }//function restartSchedule() {

    function StartScheduler() {
        if (!_schedulerOn) {
            var condition = { status: { $lt: 0 } };
            schedulerTaskModel.find(condition, function (err, docs) {
                if (err) {
                    throw new Error("StartSchedulerFindError : " + err.message);
                }//if (err) {

                if (docs) {
                    // add the first 100 records from the result set in ascending
                    // set timeout
                }//if (doc) {
            }).sort();
            // get from db
        } else {
            throw new Error("Scheduler is running. Stop or use restart");
        }//if (_schedulerOn) {

    };//function startScheduler() {

    function StopScheduler() {
        if (_schedulerOn) {
            //update database with all the required entries
            if (_taskHandle) {
                // set this task as uninitialized
                clearTimeout(_taskHandle);
            }//if (_taskHandle) {
            _schedulerOn = false;
        };
    }//function stopScheduler() {

    function ClearScheduler() {
        if (!_schedulerOn) {
            _taskArray = [];
        } else {
            stopScheduler();
            _taskArray = [];
        }
    }


    return {
        Scheduler: function () {
            return getInstance()
        },
        getInstance: function () {
            return CreateInstance();
        }//getInstance: function () {
        , setTask: function (userId, scheduledTask, params, callback) {
            var task = new Task();
            task
            if (typeof scheduledTask == 'object') {

                if (typeof params == 'object') {

                    task['params'] = params;
                    if (typeof callback == 'function') {
                        task["callback"] = callback;
                        var schedulerData = new schedulerTaskModel();
                        schedulerData.email = userId;
                        schedulerData.task = task;
                        schedulerData.save(function (err, doc, numRows) {
                            if (err) {
                                console.log(err)
                                return;
                            }//if (err) {

                            if (doc) {
                                restartSchedule();
                            }//if (doc) {

                        });
                    } else {
                        throw new Error("callback should be a valid function with two parameter.");
                    }//if (typeof callback == 'function') {
                } else {
                    throw new Error("params should be a valid object.");
                }
            }
            else {
                throw new Error("task should be a valid object.");
            }
        }//, setTask: function (task, params) {
        , removeTask: function (task) {
        }
        , stop: function () {
            stopScheduler();
        }//, stop: function () {

        , start: function () {
            startScheduler();
        }
        , restart: function () {
            restartScheduler();
        }
        //, start: function () {
    };//return {
};//var Scheduler = (function () {

module.exports = Scheduler;