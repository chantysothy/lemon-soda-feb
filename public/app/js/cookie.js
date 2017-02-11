var nvCookie , userLoginTo, cookieName = 'nv', cookieValidity = 365;
    createCookie = function (name, value, days) {
        if (days) {
            var date = new Date();
            date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
            var expires = "; expires=" + date.toGMTString();
        }
        else var expires = "";
        document.cookie = name + "=" + value + expires + "; path=/";
    }//var createCookie= function (name, value, days) {
    
    readCookie = function (name) {
        var nameEQ = name + "=";
        var ca = document.cookie.split(';');
        for (var i = 0; i < ca.length; i++) {
            var c = ca[i];
            while (c.charAt(0) == ' ') c = c.substring(1, c.length);
            if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length, c.length);
        }
        return null;
    }//var readCookie = function(name) {
    
    deleteCookie = function (name) {
        createCookie(name, "", -1);
    }//var deleteCookie = function (name) {
    
    readCookie = function (name) {
        var dc = document.cookie;
        var prefix = name + "=";
        var begin = dc.indexOf("; " + prefix);
        if (begin == -1) {
            begin = dc.indexOf(prefix);
            if (begin != 0) return null;
        }
        else {
            begin += 2;
            var end = document.cookie.indexOf(";", begin);
            if (end == -1) {
                end = dc.length;
            }
        }
        return decodeURI(dc.substring(begin + prefix.length, end));
    }//var readCookie = function (name) {
    
    // null - no cookies
    // false - only session cookies are allowed
    // true - session cookies and persistent cookies are allowed
    
    validateBrowserCookiePolicy = function () {
        var persist = true;
        do {
            var c = 'nvTest=' + Math.floor(Math.random() * 100000000);
            document.cookie = persist? c + ';expires=Tue, 01-Jan-2030 00:00:00 GMT' : c;
            if (document.cookie.indexOf(c) !== -1) {
                document.cookie = c + ';expires=Sat, 01-Jan-2000 00:00:00 GMT';
                return persist;
            }
        } while (!(persist = !persist));
        return null;
    }//var validateBrowserCookiePolicy=function() {
    
    validateCookies = function (response) {
        // check page_load for nvCookie
        if (nvCookie == null) {
            // redirect to local/signup page
            response.redirect('../signup/');
        }
        else {
            return true;
        }
    }//var validateCookies = function (res) {
    
    $manageCookies = function (data) {
        var cookie = readCookie(cookieName);
        if (cookie) {
            nvCookie = cookie;
            // see command in data
            // if create or update; create cookie with Value
            deleteCookie(cookieName);
            // update values
            createCookie(cookieName, data, cookieValidity)
        // if delete cookie ; delete cookie
        } else {
            if (validateBrowserCookiePolicy()) {
                createCookie(cookieName, data, cookieValidity);
                var returnValue = { status : 'SUCCESS', message : "Your browser is compatible for running localhost:1337" };
                return returnValue;
            }
            else {
                var returnValue = { status : 'ERROR', message : "Your browser does not support cookies. Please enable it for this application to perform normally." };
                return returnValue;
            // browser cookie policy error message
            }
        }
    }//var ManageCookies = function (data) {
    $logOut = function () {
        var data = readCookie(cookieName);
        if (data) {
            var cookieValue = removeExpiry(data);
            deleteCookie(cookieName);
            window.location.href = '/signup/local';
                //createCookie(cookieName, JSON.stringify(data), cookieValidity);
        } else {
            window.location.href = '/signup/local';
        } //if (data) { 
    }//$logOut = function () {
    
    $isLoggedIn = function () {
        var data = readCookie(cookieName);
        var returnValue = false;
    if (data) {
        // remove expiry    
        var cookieValue = removeExpiry(data);
        if (cookieValue) {
            data = JSON.parse(cookieValue);
            if (data.s == 1) {
                returnValue = true
            } 
            else {
                window.location.href = '/signup/local'
            } //if (data.s == 1)
        } else {
            window.location.href = '/signup/local'
        } //if (cookieValue) {
    }
        return returnValue;
    }//var isLoggedIn = function () {

$getClientEmail = function () {
    var returnValue;
    var data = readCookie(cookieName);
    if (data) {
        data = removeExpiry(data);
        data = JSON.parse(data);
        returnValue = data.e;

    } else {
        returnValue = false;
    }//if (data) { 
    return returnValue;
}    //$getClientEmail = function () { 
    removeExpiry = function (data) {
        // get index of '; expires='
        var returnValue;
        if (data) {
        var expiryIndex = data.indexOf('; expires=');
        if (expiryIndex > 0) {
            returnValue = data.substring(0, expiryIndex - 1);
        } else {
            var colonIndex = data.indexOf(';');
            if (colonIndex > 0) {
                returnValue = data.substring(0,colonIndex);
            } else {
                returnValue = data;
            }
            

        }
        }
        return returnValue;
    }//var removeExpiry = function (data) { 
    
    getCookieParams = function () {
        var returnValue;
        var data = readCookie(cookieName);
        if (data) {
            var temp = removeExpiry(data);
            returnValue = JSON.parse(temp);
        }
        return returnValue;
    } //var getCookieParams = function () {
//readCookie(cookieName);

