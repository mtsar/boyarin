'use strict';

module.exports = function setParsers(app, config) {

    let bodyParser = require('body-parser');
    app.use(bodyParser.urlencoded({extended: false}));

    let cookieSession = require('cookie-session');
    app.use(cookieSession(config.session));
};
