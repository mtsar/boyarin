'use strict';

let config = require('../../config');
let request = require('request');
let expect = require('expect.js');

let stage = 'test';
let workerId = 13;
let taskCount = 5;

function expectTaskList(taskList, amount) {
    expect(taskList).to.have.keys(['taskCount', 'taskRemaining', 'type', 'tasks']);

    let tasks = taskList.tasks;
    expect(tasks.length).to.be(amount);
    tasks.forEach(task => expectTask(task));
}

function expectTask(task) {
    expect(task).to.have.keys(['id', 'type', 'description', 'dateTime', 
                               'stage', 'tags', 'answers']);
    expect(task.stage).to.be(stage);
    expect(task.answers).to.be.an('array');
    expect(task.tags).to.be.an('array');
}

describe.skip('mtsar task api', function() {

    it('GET /stages/{stage}/workers/{worker}/tasks/{count} - list of tasks', function(done) {
        let url = `${config.apiURL}/stages/${stage}/workers/${workerId}/tasks/${taskCount}`;
        request.get(url, function(error, response, body) {
            let taskList = JSON.parse(body);

            expectTaskList(taskList, taskCount);

            done(error); 
        });
    });

    it('GET /stages/{stage}/workers/{worker}/task - a list with one task for worker', function(done) {
        let url = `${config.apiURL}/stages/${stage}/workers/${workerId}/task`;
        request.get(url, function(error, response, body) {
            let taskList = JSON.parse(body);
        
            expectTaskList(taskList, 1);

            done(error); 
        });
    });
});
