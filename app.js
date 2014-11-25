/**
 * Module dependencies.
 */

var express = require('express');
var compress = require('compression');
var bodyParser = require('body-parser');
var errorHandler = require('errorhandler');
var methodOverride = require('method-override');
var path = require('path');
var connectAssets = require('connect-assets');
var multer = require('multer')
var session = require('express-session');
var flash = require('express-flash');
var secrets = require('./config/secrets');
/**
 * Create Express server.
 */

var app = express(),
    http = require('http'),
    server = http.createServer(app);

/**
 * Multipart instance for req.files
 */
app.use(multer({
    dest: __dirname + '/uploads/',
    rename: function(fieldname, filename) {
        return filename.replace(/\W+/g, '-').toLowerCase() + Date.now()
    }
}));

/**
 * Express configuration.
 */

app.set('port', process.env.PORT || 3000);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');
app.use(compress());
app.use(connectAssets({
    paths: [path.join(__dirname, 'public/css'), path.join(__dirname, 'public/js')],
    helperContext: app.locals,
    compress: false
}));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded());
app.use(methodOverride());

var hour = 3600000;
var day = hour * 24;
var week = day * 7;
app.use(express.static(path.join(__dirname, 'public'), {
    maxAge: week
}));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use(flash());
app.use(session({
    secret: "secr3ts"}));


require('./config/routes')(app);

/**
 * 500 Error Handler.
 */

app.use(errorHandler());

/**
 * 404 Error Handler
 */

app.get('*', function(req, res) {
    res.json(404, {
        error: 'Oops, you are lost!'
    })
});

/**
 * Basic socket operaions
 */


// var presend tation =  io.of('/test');



// presentation.on('connection', function(socket){
//   console.log('Connection Successful on /test namespace');
// })

// presentation.emit('hi','everyone')
// presentation.on('changeSlide', function(d){ console.log(d) })
/**
 * Start Express server.
 */

server.listen(app.get('port'), function() {
    console.log("✔ Express server listening on port %d in %s mode", app.get('port'), app.get('env'));
});

module.exports = app;