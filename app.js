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
app.engine('hbs', require('express-handlebars')({extname: 'hbs'}));
app.set('view engine', 'hbs');

app.use(function(req, res, next) {
    res.locals.user = req.user;
    res.locals.config = config;
    next();
});

app.get('/', function(req, res, next) {
    if (req.user) {
        request.get(config.processURL + '/workers/' + req.user.worker + '/task', function(err, data, body) {
            if (data.statusCode === 204) {
                return res.render('main');
            }

            console.log('TASK', body);

            try {
                res.render('main', {task: JSON.parse(body).task});
            } catch (err) {
                next(err);
            }
        });
    } else {
        res.render('main');
    }
});

app.post('/submit', function(req, res, next) {
    if (req.user) {
        request.post(config.processURL + '/tasks/' + req.body.id + '/answers', {form: {
            worker_id: req.user.worker,
            answers: req.body.answers
        }}, function(err, data, body) {
            res.redirect('/');
        });
    }
});

// auth

passport.serializeUser(function(user, done) {
    findOrCreateWorker(user.id, function(err, worker) {
        try {
            done(err, {id: user.id, worker: JSON.parse(worker).id});
        } catch (err) {
            done(err, null);
        }
    });
});

function findOrCreateWorker(externalID, done) {
    request.get(config.processURL + '/workers/external?' + qs.stringify({externalId: externalID}), function(err, data, body) {
        if (data.statusCode === 404) {
            request.post(config.processURL + '/workers', {form: {external_id: externalID}}, function(err, data, body) {
                done(err, body);
            });
        } else {
            done(err, body);
        }
    });
}

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
    console.log(err);
});
