'use strict';

module.exports = function getHomeRouter(config, connector) {
    let home = require('express').Router();

    home.get('/', config.disabled ? disabledHandler : homeHandler);

    home.get('/about', (req, res) => {
        res.render('about');
    });

    function homeHandler(req, res, next) {
        connector.getStages((err, stages) =>{
            if(err) return next(err);

            if(Array.isArray(config.stages)) {
                stages = stages.filter((stage) => config.stages.indexOf(stage.id) >= 0);
            }

            res.render('home', {stages: stages});
        });
    }

    function disabledHandler(req, res, next) {
        res.render('disabled');
    }

    return home;
};
