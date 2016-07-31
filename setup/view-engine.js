'use strict';

module.exports = function setViewEngine(app) {
    let expressHandlebars = require('express-handlebars');
    let handlebarsConfig = {
        defaultLayout: 'main',
        extname: '.hbs'
    };

    app.engine('.hbs', expressHandlebars(handlebarsConfig));
    app.set('view engine', '.hbs');
};
