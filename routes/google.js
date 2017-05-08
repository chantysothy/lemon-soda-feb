var express = require('express');
var router = express.Router();

var userModel = require('../models/user');
var userUtils = require('../utils/userUtils');

var config = require('../config/config');
router.get('/google/youtube', function () { 

}); //router.get('/google / youtube ', function () { 
router.get('/google/locs', function (req, res) { 

}); //router.get('/google/gplus', function (req, res) { 

router.post('/plus/post/write', function (req, res) { });
router.get('/plus/post/read', function (req, res) { });

router.get('/plus/collections', function (req, res) { });
router.get('/plus/collections/read', function (req, res) { });
router.post('/plus/collections/write', function (req, res) { });

router.get('/plus/circles', function (req, res) { });
router.get('/plus/circles/read', function (req, res) { });
router.post('plus/circles/write', function (req, res) { });


module.exports = router;