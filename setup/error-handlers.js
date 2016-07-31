'use strict';

module.exports = function setErrorHandlers(app) {

    app.use((req, res, next) => {
        res.render('error', {error: {message: "Страница не найдена"}});
    });

    app.use((err, req, res, next) => {
        res.status(err.status || 500);

        if(process.env.NODE_ENV === "production") {
            console.warn(err);
            err.message = "Внутренняя ошибка";
            err.stack = "";
        }
        
        res.render('error', {error: err});
    });
};
