'use strict';

module.exports = function setPiwik(app, config) {
    if (!config.piwik) {
        return;
    }

    app.use(function (req, res, next) {
        res.locals.piwik = {
            url: config.piwik.url || "localhost:8083",
            siteId: config.piwik.siteId || "1",
        };
        next();
    });
};
