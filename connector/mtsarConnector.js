'use strict';

let request = require('request');
let qs = require('querystring');

function hackError(error, additionMessage) {
    if(!error) return;

    error.message = `${additionMessage}\n${error.message}`;
}

class MtsarConnector{
    constructor(config){
        this.apiURL = config.apiURL;
    }

    getStages(callback){
        let url = `${this.apiURL}/stages`;
        request.get(url, (error, response, body) => {
            hackError(error, 'Не удалось получить список этапов разметки');
            callback(error, body);
        }).json();
    }    

    getStage(stageId, callback){
        let url = `${this.apiURL}/stages/${stageId}`;

        request.get(url, (error, response, stage) => {
            hackError(error, `Не удалось получить этап ${stageId}`);
            if(stage.code === 404)
                return callback(error, undefined);
            callback(error, stage);
        }).json();
    }

    getWorker(stageId, workerTag, callback) {
        let url = `${this.apiURL}/stages/${stageId}/workers/tagged/${encodeURIComponent(workerTag)}`;
        request.get(url, (error, response, worker) => {
            hackError(error, `Не удалось получить worker:${workerTag}`);
            if(worker && worker.code === 404)
                return callback(error, undefined);
            callback(error, worker);
        }).json();
    }

    createWorker(stageId, workerTag, callback) {
        let url = `${this.apiURL}/stages/${stageId}/workers`;
        request.post(url, { form: {tags: workerTag} }, (error, response, body) => {
            hackError(error, `Не удалось создать worker:${workerTag}`);
            let worker = JSON.parse(body);
            if(worker.code === 404)
                return callback(error, undefined);
            callback(error, worker);
        });
    } 

    getTasks(stageId, workerId, count, callback) {
        let url = `${this.apiURL}/stages/${stageId}/workers/${workerId}/tasks/${count}`;
        request.get(url, (error, response, tasks) => {
            hackError(error, `Не удалось получить задания для s|${stageId}:w|${workerId}`);
            callback(error, tasks);
        }).json();
    }

    getTasksById(stageId, workerId, id, callback) {
        let query = qs.stringify({task_id: id});
        let url = `${this.apiURL}/stages/${stageId}/workers/${workerId}/tasks?${query}`;
        request.get(url, (error, data, tasks) => {
            hackError(error, `Не удалось получить задания для id${id}`);
            callback(error, tasks);
        }).json();
    }

    sendAnswers(stageId, workerId, answers, callback) {
        let url = `${this.apiURL}/stages/${stageId}/workers/${workerId}/answers`;
        request.patch(url, {form: answers}, (error, data, body) => {
            hackError(error, `Не удалось отправить задания`);
            let answerErrors = null;
            if(!error && data.statusCode < 400)
                answerErrors = JSON.parse(body).errors;
            callback(error, answerErrors);
        });
    }
}

module.exports = MtsarConnector;
