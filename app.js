/**
 * Module dependencies.
 */

var express = require('express'),
    http = require('http'),
    path = require('path'),
    exec = require('child_process').exec,
    Q = require('q');

var app = express();

app.configure(function () {
    app.set('port', process.env.PORT || 3000);
    app.set('views', __dirname + '/views');
    app.set('view engine', 'jade');
    app.use(express.favicon());
    app.use(express.logger('dev'));
    app.use(express.bodyParser());
    app.use(express.methodOverride());
    app.use(express.cookieParser('your secret here'));
    app.use(express.session());
    app.use(app.router);
    app.use(require('less-middleware')({ src: __dirname + '/public' }));
    app.use(express.static(path.join(__dirname, 'public')));
});

app.configure('development', function () {
    app.use(express.errorHandler());
});

app.get('/', function (req, res) {
    res.render('index', { title: 'Mac Remote' });
});

app.get('/backup/pause', function (req, res) {
    exec('/Library/Backblaze/bztransmit -pausebackup', function (error, stdout, stderr) {
        if (error) {
            console.info(stderr);
        } else {
            console.info(stdout);
        }
    });
    exec('killall arqcommitter', function (error, stdout, stderr) {
        if (error) {
            console.info(stderr);
        } else {
            console.info(stdout);
        }
    });
    exec('killall Arq', function (error, stdout, stderr) {
        if (error) {
            console.info(stderr);
        } else {
            console.info(stdout);
        }
    });
    exec('killall "Arq Agent"', function (error, stdout, stderr) {
        if (error) {
            console.info(stderr);
        } else {
            console.info(stdout);
        }
    });
    res.redirect('/');
});

app.get('/backup/start', function (req, res) {
    exec('/Library/Backblaze/bztransmit -completesync', function (error, stdout, stderr) {
        if (error) {
            console.info(stderr);
        } else {
            console.info(stdout);
        }
    });
    exec('open /Applications/Arq.app', function (error, stdout, stderr) {
        if (error) {
            console.info(stderr);
        } else {
            console.info(stdout);
        }
    });

    res.redirect('/');
});


http.createServer(app).listen(app.get('port'), function () {
    console.log("Express server listening on port " + app.get('port'));
});
