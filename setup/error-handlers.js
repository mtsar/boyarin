'use strict';

const NotFound = require("http-errors").NotFound;

module.exports = function setErrorHandlers(app) {

    app.use((req, res, next) => next(new NotFound("Страница не найдена")));

    app.use((err, req, res, next) => {
        res.status(err.status || 500);

        if(err instanceof NotFound) {
            // TODO replace console for logger
            console.warn(err);
            return res.render("not-found");
        }

        if(process.env.NODE_ENV === "production") {
            console.warn(err);
            err.message = "Внутренняя ошибка";
            err.stack = "";
        }

        res.render('error', {error: err});
    });
};
