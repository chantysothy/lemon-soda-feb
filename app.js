var express = require('express');
var contentType = require('content-type');
var getRawBody = require('raw-body');
var path = require('path');
var expressSession = require('express-session');
var router = require('./routes/index');
var tweets = require('./routes/tweets');
var google = require('./routes/google');
var streamer = require('./routes/streamer.js');
var vignette = require('./routes/vignette.js');
var scheduler = require('./routes/scheduler.js');
var postManager = require('./routes/postmanager.js');
var fileManager = require('./routes/fileManager.js');
var fs = require('fs');
var mongodb = require('mongodb');
var mongoose = require('mongoose');
var passport = require('passport');
var localPassport = require('./config/passport')(passport,app);
var configDB = require('./config/database.js');
var userConfig = require('./routes/user-config');
// configuration ===============================================================
mongoose.connect(configDB.url); // connect to our database
//require('./config/passport')(passport); // pass passport for configuration
var sslCertInfo = {
    key: fs.readFileSync('certs/nectorr.key')
    , cert: fs.readFileSync('certs/nectorr.crt')
    , ca: fs.readFileSync('certs/gd_bundle-g2-g1.crt')
    , requestCert: false
    , rejectUnauthorized : false
}
var httpApp = express();
var httpServer = require('http').createServer(httpApp);
var app = express();
var server = require('https').createServer(sslCertInfo, app);

httpApp.all('*', ensureSecure);
function ensureSecure(req, res, next) {
    if (req.secure) {
        // OK, continue
        return next();
    };
    // handle port numbers if you need non defaults
    // res.redirect('https://' + req.host + req.url); // express 3.x
    res.redirect('https://' + req.hostname + req.url); // express 4.x
}
var bodyParser = require('body-parser');

app.use(bodyParser.urlencoded({ extended: false, limit: '50mb' }));
//app.use(express.limit('10mb'));    
//app.route(router);
// serve static assets from the public directory
//app.configure(function);
app.use(function (req, res, next) {
    res.header('X-XSS-Protection', 0);
    res.header('X-App-Name', 'nectorr');
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Credentials', true);
    //res.header('Access-Control-Allow-Origin', req.headers.origin);
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
    //res.header('Access-Control-Allow-Headers', 'X-Requested-With, X-HTTP-Method-Override, Content-Type, Accept');
    res.header("Access-Control-Max-Age", "86400"); // 24 hours
   // res.header("Content-Length", res.body.length); 
    // intercept OPTIONS method
    if ('OPTIONS' == req.method) {
        res.send(200);
    }
    else {
        next();
    }});
app.use(expressSession(
    {
        secret: 'vidurkohli',
        resave: false,
        saveUninitialized: true,
        cookie: { secure: true }
    }
));
//app.use(express.json());
//app.use(express.bodyParser({ limit: '50mb' }));
app.use(passport.initialize());
app.use(passport.session()); // persistent login sessions

app.use(express.static(path.join(__dirname, 'public')));
//app.use(express.cookieParser()); // read cookies (needed for auth)
//app.use(express.bodyParser()); // get information from html forms


// look for view html in the views directory
app.set('views', path.join(__dirname, 'views'));

// use ejs to render 
app.set('view engine', 'ejs');

// setup routes
app.use('/', router);
app.use(google);
app.use(tweets);
app.use(userConfig);
app.use(streamer);
app.use(vignette);
app.use(scheduler);
app.use(postManager);
app.use(fileManager);


var port = 1337;//process.env.PORT || 5000;
app.set('port', port);
//module.exports = app;
module.exports = server;
server.listen(8443, function() {
  console.log('nectorr is listening on ' + 8443);
});
httpServer.listen(port, function () {
    console.log('nectorr http is listening at ' + port);
});
//server.listen(80, '192.169.178.96', function () {
//  console.log('localhost:1337 is listening on ' + port);
//});