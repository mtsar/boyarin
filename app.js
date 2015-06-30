var express = require('express'),
    request = require('request'),
    config = require('./config.json');
    passport = require('passport'),
    bodyParser = require('body-parser'),
    FBStrategy = require('passport-facebook'),
    VKStrategy = require('passport-vkontakte').Strategy,
    qs = require('querystring');

var app = express();

app.listen(process.env.PORT || config.port);

app.use(bodyParser.urlencoded({extended: false}));
app.use(express.static('./public'));
app.use(require('morgan')('dev'));
app.use(require('express-session')(config.session));
app.use(passport.initialize());
app.use(passport.session());
app.engine('hbs', require('express-handlebars')({extname: 'hbs', defaultLayout: 'layout'}));
app.set('view engine', 'hbs');

app.use(function(req, res, next) {
    res.locals.config = config;
    res.locals.user = req.user;
    next();
});

function auth(req, res, next) {
    if (req.user) {
        next();
    } else {
        res.redirect('/auth/login');
    }
}

app.get('/', auth, function(req, res, next) {
    request.get(config.apiURL + '/processes', function(err, data, body) {
        if (err) {
            return next(err);
        }

        res.render('processes', {
            processes: body.filter(function(item) {
                return config.processes.indexOf(item.id) !== -1;
            }).sort(function(a, b) {
                return config.processes.indexOf(a.id) > config.processes.indexOf(b.id);
            })
        });
    }).json();
});

app.get('/:process', auth, checkProcess, function(req, res, next) {
    request.get(config.apiURL + '/processes/' + req.params.process + '/workers/' + req.user.worker + '/task', function(err, data, body) {
        if (err) {
            return next(err);
        } else if (data.statusCode === 204) {
            return res.render('empty');
        }

        res.render('task', {process: req.params.process, task: body.task});
    }).json();
});

app.post('/:process', auth, checkProcess, function(req, res, next) {
    request.post(config.apiURL + '/processes/' + req.params.process + '/tasks/' + req.body.id + '/answers', {form: {
        worker_id: req.user.worker,
        answers: req.body.answers
    }}, function(err, data, body) {
        res.redirect('/' + req.params.process);
    });
});

function checkProcess(req, res, next) {
    if (config.processes.indexOf(req.params.process) === -1) {
        return res.status(404).end();
    }

    if (req.user.process !== req.params.process) {
        findOrCreateWorker(req.params.process, req.user.id, function(err, worker) {
            if (err) {
                return next(err);
            }

            req.user.process = req.params.process;
            req.user.worker = worker.id;
            next();
        });
    } else {
        next();
    }
}

function findOrCreateWorker(process, externalID, done) {
    var processURL = config.apiURL + '/processes/' + process;

    request.get(processURL + '/workers/external?' + qs.stringify({externalId: externalID}), function(err, data, body) {
        if (data.statusCode === 404) {
            request.post(processURL + '/workers', {form: {external_id: externalID}}, function(err, data, body) {
                done(err, body);
            }).json();
        } else {
            done(err, body);
        }
    }).json();
}

// auth

passport.serializeUser(function(user, done) {
    done(null, {id: user.id});
});

passport.deserializeUser(function(user, done) {
    done(null, user);
});

passport.use(new FBStrategy(config.facebook, function(accessToken, refreshToken, profile, done) {
    done(null, {id: 'facebook' + profile.id});
}));

app.get('/auth/fb', passport.authenticate('facebook'));
app.get('/auth/fbcallback', passport.authenticate('facebook', {successRedirect: '/'}));

passport.use(new VKStrategy(config.vkontakte, function(accessToken, refreshToken, profile, done) {
    done(null, {id: 'vkontakte' + profile.id});
}));

app.get('/auth/vk', passport.authenticate('vkontakte'));
app.get('/auth/vkcallback', passport.authenticate('vkontakte', {successRedirect: '/'}));

app.get('/auth/login', function(req, res, next) {
    res.render('login');
});

app.get('/auth/logout', function(req, res, next) {
    req.logout();
    res.redirect('/');
});

// handle 404

app.use(function(req, res, next) {
    res.status(404).end('404');
});

// handle errors

app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error');
    console.log(err);
});
