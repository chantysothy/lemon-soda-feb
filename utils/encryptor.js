var mongoose = require('mongoose');
var Crypto = require('crypto-js');
var dbModel = require('../models/encSchema');
var separator = '~'
var algorithm = 'aes-256-ctr',
    password = 'd6F3Efeq';
var Encryptor = function () {

    Encryptor.prototype.encrypt = function (val) {
        var returnValue;
        var cipher = crypto.createCipher(algorithm, password)
        
        var returnValue = cipher.update(val, 'utf8', 'hex')
        
        returnValue += cipher.final('hex');
        
        return returnValue;
    }
    Encryptor.prototype.decrypt = function (val) {
        var decipher = crypto.createDecipher(algorithm, password)
        
        var dec = decipher.update(val, 'hex', 'utf8')
        
        dec += decipher.final('utf8');
        
        return dec;
    }

}
module.exports = Encryptor;