'use strict';

module.exports = function setFavicon(app) {

    let serveFavicon = require('serve-favicon'),
        path = require('path');
    
    let faviconPath = path.resolve('./favicon.ico');
    app.use(serveFavicon(faviconPath));

};
