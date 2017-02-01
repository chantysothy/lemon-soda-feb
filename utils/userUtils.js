function UserUtils() {
    

}
UserUtils.prototype.CreateCookieValueForUser = function (_id) {
    
    
    var returnValue;
    var time;
    if (_id) {
        time = Date.now();
        //create salt
        returnValue = _id + "$" + time.toString();
    }
        return returnValue;
}

module.exports = UserUtils;
