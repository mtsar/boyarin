'use strict';

const utils = require("./utils");

module.exports = function getStageRouter(config, connector) {
    let express = require('express');
    let stageRouter = express.Router();

    if(config.disabled)
        return configureDisabledRouter(stageRouter);

    return configureRouter(stageRouter);

    function configureRouter(router) {
        router.get('/', (req, res) => {
            res.redirect(303, '../');
        });

        router.get('/:stage', getStage, getWorker, createWorker, getTasks, renderTasks);
        router.post('/:stage', getStage, getWorker, sendAnswers, getTasks, renderTasks);

        return router;  
    }

    function configureDisabledRouter(router) {
        router.get('/*', (req, res) => {
            res.redirect(307, '/');
        });

        return router;
    }

    // Middlewares

    function getStage(req, res, next) {
        if (config.stages && config.stages.indexOf(req.params.stage) === -1) {
            return res.status(404).end();
        }

        connector.getStage(req.params.stage, (err, stage) => {
            if(err) return next(err);
            if(!stage) return next(404);

            res.locals.stage = stage;
            next();
        });
    }

    function getWorker(req, res, next) {
        connector.getWorker(req.params.stage, res.locals.worker.tag, (err, worker) => {
            if(err) return next(err);

            res.locals.worker = worker || res.locals.worker;
            next();
        });
    }

    function createWorker(req, res, next) {
        if(res.locals.worker.id) return next();

        connector.createWorker(req.params.stage, res.locals.worker.tag, (err, worker) => {
            if(err) return next(err);

            res.locals.worker = worker;
            next();
        });
    }

    function getTasks(req, res, next) {
        const stageId = req.params.stage;
        const workerId = res.locals.worker.id;
        const tasksId = res.locals.tasksId;
        const answers = res.locals.answers;
        const numberOfTasks = res.locals.stage.options.tasksPerPage || 1;

        if(tasksId) { 
            connector.getTasksById(stageId, workerId, tasksId, callback);
        } else {
            connector.getTasks(stageId, workerId, numberOfTasks, callback);
        }

        function callback(err, taskList) {
            if(err) return next(err);
            res.locals.taskList = utils.prepareTasksList(taskList, answers);
            next();
        }
    }

    function sendAnswers(req, res, next) {
        const getArray = (value) => Array.isArray(value) ? value: [value];
        const taskId = getArray(req.body.task);
        
        const answers = {};
        taskId.forEach(function(task) {
            let answer = req.body[`answers[${task}]`];
            answers[task] = answer ? getArray(answer) : null;
        });

        if(taskId.map(Number).sort().join("_") !== req.session.token)
            return res.redirect(303 , `./${req.params.stage}`);            
        
        let formData = { answers: answers, tags: `tasks${taskId.join('_')}` };
        connector.sendAnswers(req.params.stage, res.locals.worker.id, formData, (err, answerErrors) => {
            if(err) return next(err);
            if(answerErrors) {
                res.locals.tasksId = taskId;
                res.locals.answers = answers;
                res.locals.errors = utils.localizeValidationErrors(answerErrors);
            }
     
            next();
        });
    }

    function renderTasks(req, res, next) {
        const taskList = res.locals.taskList;

        if(!taskList) {
            return res.render('empty');
        }

        req.session.token = taskList.tasks.map(t => t.id).sort().join('_');

        if(['russe'].indexOf(req.params.stage) >= 0) {
            res.render(`stage/${req.params.stage}`);
        } else {
            res.render('stage/task');
        }
    }
};
