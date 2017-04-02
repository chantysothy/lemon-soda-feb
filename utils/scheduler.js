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
                        var timeline = task.schedule;
                        timeline = this.quicksort(timeline, 0, timeline.length);
                        timeline = this.curateTimeLine(timeline);
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

    }////this.SetTask = function (userId, task, params, callback) {

    this.startScheduler = function () {

    }////this.SetTask = function (userId, task, params, callback) {

    this.restartScheduler = function () {

    }////this.SetTask = function (userId, task, params, callback) {
    //====SINGLETON CLASS DEFINITION=====================================

    Scheduler.getInstance = function () {
        if (this._instance == null) {
            this._instance = new Scheduler();
        }//if (this._instance== null){
        return this._instance;
    }//Scheduler.getInstance(){

    Scheduler.start = function () {
        if (!this._started) {
            // get the first
        } else {
            throw new Error("Scheduler is running. Stop the scheduler to start again.");
        }
    }//Scheduler.start = function () {

    Scheduler.stop = function () {

    }//Scheduler.stop = function () {

    Scheduler.restart = function () {

    }////Scheduler.stop = function () {
}//var Scheduler = function Scheduler() {