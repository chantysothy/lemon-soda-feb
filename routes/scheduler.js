var express = require('express');
var router = express.Router();
var nts = require('node-task-scheduler');
var schedulerModel = require('../models/schedulerData');
var Scheduler= require('../utils/scheduler');
var config = require('../config/config');
var userModel = require('../models/user');
var Itener = require('../utils/itener');//.getInstance();
var itener = new Itener().getInstance();
itener.start();
var partitionIndex = -2;
router.post('/scheduler/add', function (req, res) {
    var callback = req.body.callback;
    if (callback) {
        var email = req.body.email;
        var schedulerObject = JSON.parse(req.body.schedulerObject);
        if (schedulerObject) {
            var schedulerInfo
            getSchedulerObjectFromDatabase(schedulerInfo, function (schedulerInfo) {
                if (schedulerInfo.found) {
                    sendMessageToServer({
                        status: "ERROR", message: "The requested Scheduler object was located. Cannot create duplicates.", data: schedulerInfo.data
                    }, callback, res);
                } else {
                    var schObject = new schedulerModel(schedulerObject);
                    schObject.save(function (err, doc, numRows) {
                        if (err) {
                            sendMessageToServer({status: "ERROR", message: "Unable to add scheduler to database at this moment. Please try after sometime."}, callback, res);
                        } else {
                            sendMessageToServer({status : "SUCCESS", message: "Scheduler data added to nectorr database.", data : doc._doc}, callback, res);
                        }//if (err) {
                    }); //schObject.save(function (err, doc, numRows) { 
                } //if (schedulerInfo.found) {
            }); //sendMessageToServer({

        }//if (schedulerObject) {
    }//if (callback) {
});//router.post('/scheduler/add', function (req, res) {

router.post("/scheduler/now", function (req, res) {
    var callback = req.body.callback;
    if (callback) {
        var schedulerId = req.body.scheduler_id;
        if (schedulerId) {
            var condition = { _id: schedulerId };
            schedulerModel.findOne(condition, function (err, doc) {
                if (err) {
                    sendMessageToServer({ status: "ERROR", message: "An error occured while fetching data for scheduling. Please try after sometime" }, callback, res);
                    return;
                }//if (err) {

                if (doc) {
                    //scheduler
                    setScheduler();
                    var schedulerId = new Date().getTime().toString();
                    scheduler.addTask(schedulerId, { hello: 'world' }, function (args, callback) {
                        console.log("Hello from hello! ", "ARGS: " + args[schedulerId]);
                        callback();
                    }, "0 * * * * *", endDate);

                }//if (doc) {
            });//schedulerModel.findOne(condition, function (err, doc) {
        } else {
            sendMessageToServer({ status: "ERROR", message: "Invalid scheduler id. Cannot schedule this object" }, callback, res);
        }//if (schedulerId) {
    }//if (callback) {
});//router.post("/scheduler/post-now", function (req, res) {

router.post('/scheduler/new', function (req, res) {
    var email = req.body.email;
    var message;
    var a = itener.isRunning()
    if (email) {
        var condition = { "local.email": email };
        userModel.findOne(condition, function (err, doc) {
            if (err) {
                message = { status: "ERROR", message: "An error occured while validating user credentials." };
                sendMessageToServer(message, null, res, true);
                return;
            }

            //if (err) {

            //if (doc) {
                var dataToPost = JSON.parse(req.body.dataToPost);
                var vignetteTimelines = JSON.parse(req.body.timelines);

            //    if (vignetteTimelines.timeline.length > 0) {
            //        vignetteTimelines.timeline = quickSort(vignetteTimelines.timeline, 0, vignetteTimelines.timeline.length - 1);

                    dataToPost['executeAt'] = vignetteTimelines.timeline[0];
                    dataToPost['timeLine'] = vignetteTimelines;
                    itener.on('Itener_TaskStart', function (taskData) {
                        var a = taskData;
                    });//itener.on('Itener_TaskStart', function (taskData) {

                    itener.on('Itener_Error', function (err) {
                        var message = { status: "ERROR", message: " An error occured while scheduling your post(s.) " + JSON.stringify(err) }
                    });//itener.on('Itener_Error', function (err) {

                    itener.on('Itener_Task_Scheduled', function (taskData) {
                        var a = taskData;
                    });
                    itener.schedule(email, dataToPost, null);
            //        //dataToPost['callback'] = schedulerCallback;
            //        dataToPost['vignettes'] = JSON.parse(req.body.vignettes);
                    
            //        var taskInfo = { "email": email, task: dataToPost, executeAt: vignetteTimelines.timeline[0], 'callback': schedulerCallback}
            //        schedulerModel.create(taskInfo, function (err, docs) {
            //            if (err) {
            //                message = { status: "ERROR", message: "We encountered an error while updating your tasks to nectorr databases." };
            //                sendMessageToServer(message, null, res, true);
            //                return;
            //            }//if (err) {
            //            if (doc) {
            //                message = { status: "SUCCESS", message: "Tasks successfully submitted. Nectorr shall execute it for you." };
            //                sendMessageToServer(message, null, res);

            //                //if (!Scheduler.isRunning()) {
            //                //    Scheduler.startScheduler();
            //                //}//if (!Scheduler.isRunning()) {
            //            }//if (doc) {
            //        });//schedulerModel.create(taskInfo, function (err, docs) {
            //    }//if (vignetteTimelines.length > 0) {
            //}//if (doc) {

        });//userModel.findOne(condition, function (err, doc) {

    } else {
        message = { status: "ERROR", message: "user credentials are not valid." }
        sendMessageToServer(message, null, res, true);
    }
        //if (email) {
        //    //var postScheduler = scheduler
        //    var vignettes = JSON.parse(req.body.dataToPost).vignettes;
        //    if (!Scheduler.isRunning()) {
        //        Scheduler.startScheduler()
        //    }
        //    var dataToPost = JSON.parse(req.body.dataToPost);
        //    //dataToPost['vignettes'] = vignettes;
        //    var vignetteTimelines = JSON.parse(req.body.timelines);
        //    var task = {
        //        name: email + Date.now()
        //        , timelines: getMilliSeconds(vignetteTimelines)
        //    }
        //    Scheduler.setTask(email, task, dataToPost, function (taskData) {
        //        var a = taskData
        //    });
        //}//if (email) {
});

router.post('/scheduler/edit', function (req, res) {

});//router.post('/scheduler/edit', function (req, res) {

router.get('/scheduler/delete', function (req, res) {

});//router.post('/scheduler/delete', function (req, res) {

var getSchedulerObjectFromDatabase = function (schedulerInfo, callback) {
    if (callback) {
        var condition = { email: schedulerInfo.email, dateTime: schedulerInfo.dateTime, completed: schedulerInfo.status.completed, deleted: false };

        schedulerModel.findOne(condition, function (err, doc) {
            if (!err) {
                callback({found : true, data : doc._doc});
            } else {
                callback({found : false , error : err});
            }//if (!err) {
        });//schedulerModel.findOne(condition, function (err, doc) {
    }//if (callback) {
}; //var getSchedulerObjectFromDatabase = function(schedulerInfo, callback) {
var setScheduler = function () {
    scheduler = nts.init();
    global.scheduler = scheduler;
    scheduler.on('scheduler', function (type, pid, msg) {
        switch (type) {
            case 'task_loop':
                // When an execution is over and the next execution starts
                manageSchedulerTaskLoop(type, pid, msg);
                break;
            case 'task_exit':
                // Task`s last execution. Loop ends.
                manageSchedulerTaskExit(type, pid, msg);
                break;
            case 'task_error':
                // task error. Loop ends.
                manageSchedulerTaskError(type, pid, msg);
                break;
            default: break;
        }
    })//scheduler.on('scheduler', function (type, pid, msg) {
}//var setScheduler = function () {
var deleteScheduler = function(schedulerInfo, callback) {

}//var deleteScheduler = function (schedulerInfo, callback) {
var manageSchedulerTaskLoop = function (type, pid, msg) {
}//var manageSchedulerTaskLoop = function(type, pid, msg){
var manageSchedulerTaskExit = function (type, pid, msg) {
    //save to database or update records with timelines
}//var manageSchedulerTaskExit = function (type, pid, msg) {
var manageSchedulerTaskError = function (type, pid, msg) {
    //
}//var manageSchedulerTaskError = function (type, pid, msg) {
var sendMessageToServer = function (msg, callback, res, post) {//= false) {
    // msg has to be a valid json object
    var payload = JSON.stringify(msg);
    payload = payload.replace(/\\n/g, "\\n")
        .replace(/\\'/g, "\\'")
        .replace(/\\"/g, '\\"')
        .replace(/\\&/g, "\\&")
        .replace(/\\r/g, "\\r")
        .replace(/\\t/g, "\\t")
        .replace(/\\b/g, "\\b")
        .replace(/\\f/g, "\\f");
    // remove non-printable and other non-valid JSON chars
    payload = payload.replace(/[\u0000-\u0019]+/g, "");
    var response = JSON.stringify(msg);

    if (callback == null) {
        res.write(response);
        res.end();
        return;
    }//if (callback == null) {
    //res.writeHead(200, { 'Content-Type': 'text/plain', 'Content-Length': +response.length + '' });

    if (!post) {
        var returnValue = callback + '(' + response + ')';
        res.send(returnValue);
        res.end();
    } else {
        res.write(returnValue);
        res.end();
    }
}
var getMilliSeconds = function (input) {
    var returnValue = [];

    for (var counter = 0; counter < input.timeline.length; counter++) {
        var date = Date.parse(input.timeline[counter]);
        if (date) {
            returnValue.push(date);
        }

    }//for (var counter = 0; counter < input.length; counter++) {

    return returnValue;
}//var getMilliSeconds = function (input) {
var quickSort = function (arr, left, right) {
    var len = arr.length,
        pivot
        ;
    if (left < right) {
        pivot = right;
        partitionIndex = partition(arr, pivot, left, right);

        //sort left and right
        quickSort(arr, left, partitionIndex - 1);
        quickSort(arr, partitionIndex + 1, right);
    }
    return arr;
}//function quickSort(arr, left, right)

var partition = function (arr, pivot, left, right) {
    var pivotValue = arr[pivot];
    partitionIndex = left;

    for (var i = left; i < right; i++) {
        if (arr[i] < pivotValue) {
            swap(arr, i, partitionIndex);
            partitionIndex++;
        }
    }//function partition(arr, pivot, left, right) {
    swap(arr, right, partitionIndex);
    return partitionIndex;
} //var partition = function (arr, pivot, left, right) {

var swap = function (arr, i, j) {
    var temp = arr[i];
    arr[i] = arr[j];
    arr[j] = temp;
}//var swap = function (arr, i, j) {
var schedulerCallback = function (error, taskInfo, params) {
    var a = error;
    alert(JSON.parse(taskInfo));
}//var callback = function (error, taskInfo, params) {
module.exports = router;