var express = require('express'),
    http = require('http'),
    path = require('path'),
    exec = require('child_process').exec,
    _ = require('underscore');

_.str = require('underscore.string');

var app = express();

app.configure(function () {
    app.set('port', process.env.PORT || 9000);
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
    app.locals.pretty = true;
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
    /**
     * Arq.app/Contents/MacOS/Arq
     * 'backupnow', 'pause' and 'resume' command-line functions
     */
    exec('/Applications/Arq.app/Contents/MacOS/Arq pause 120', function (error, stdout, stderr) {
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
    exec('/Applications/Arq.app/Contents/MacOS/Arq resume', function (error, stdout, stderr) {
        if (error) {
            console.info(stderr);
        } else {
            console.info(stdout);
        }
    });
    res.redirect('/');
});

/**
 * Probably vulnerable to inject attacks.  Enable at your own risk.
 */
//app.get('/say/:something', function (req, res) {
//    var something = req.params.something || '';
//    if (_.str.isBlank(req.params.something)) {
//        res.send(400);
//        return;
//    }
//    var sanitized = _.str.humanize(something.replace(/[^\d\w\s]/gi, ''));
//    exec('say "' + something + '"', function (error, stdout, stderr) {
//        if (error) {
//            console.info(stderr);
//        } else {
//            console.info(stdout);
//        }
//    });
//    res.send(200);
//});


http.createServer(app).listen(app.get('port'), function () {
    console.log("Express server listening on port " + app.get('port'));
});
