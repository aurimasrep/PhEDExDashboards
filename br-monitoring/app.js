var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var routes = require('./routes/index');
var routesSumCurrent = require('./routes/br-sum-current');
var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', routes);
app.use('/br-sum-current', routesSumCurrent);

// setup JS+CSS dependencies
app.use('/js', express.static(__dirname + '/node_modules/bootstrap/dist/js')); // redirect bootstrap JS
app.use('/js', express.static(__dirname + '/node_modules/jquery/dist')); // redirect JS jQuery
app.use('/js', express.static(__dirname + '/node_modules/d3/build')); // redirect JS D3
app.use('/js', express.static(__dirname + '/node_modules/d3-queue/build'));
app.use('/js', express.static(__dirname + '/node_modules/plotly.js/dist'));
app.use('/js', express.static(__dirname + '/public/javascripts/'));
app.use('/js', express.static(__dirname + '/node_modules/daterangepicker'));
app.use('/js', express.static(__dirname + '/node_modules/moment'));
app.use('/js', express.static(__dirname + '/node_modules/underscore'));
app.use('/js', express.static(__dirname + '/node_modules/bootstrap-select/dist/js'));
app.use('/js', express.static(__dirname + '/node_modules/bootstrap-switch/dist/js'));

app.use('/css', express.static(__dirname + '/public/stylesheets/'));
app.use('/css', express.static(__dirname + '/node_modules/bootstrap/dist/css'));// redirect CSS bootstrap
app.use('/css', express.static(__dirname + '/node_modules/bootstrap-select/dist/css'));
app.use('/css', express.static(__dirname + '/node_modules/bootstrap-switch/dist/css/bootstrap3'));

// catch 404 and forward to error handler
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use(function(err, req, res, next) {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: err
        });
    });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {}
    });
});

module.exports = app;
