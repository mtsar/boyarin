"use strict";

let expect = require('expect.js');

module.exports = {
    stage: function(stage) {
        expect(stage).to.have.keys(['id', 'description', 'options']);
        expect(stage.id).to.be.a('string');
        expect(stage.description).to.be.a('string');
        expect(stage.options).to.be.an('object');
    },
    taskList: function(taskList, amount) {
        expect(taskList).to.have.keys(['taskCount', 'taskRemaining', 'type', 'tasks']);

        let tasks = taskList.tasks;
        expect(tasks.length).to.be(amount);
        tasks.forEach(task => this.task(task));
    }, 
    task:function (task) {
        expect(task).to.have.keys(['id', 'type', 'description', 'dateTime', 
                                'stage', 'tags', 'answers']);
        expect(task.answers).to.be.an('array');
        expect(task.tags).to.be.an('array');
    },
    worker: function (worker) {
        expect(worker.id).to.be.a('number');
        expect(worker.stage).to.be('test');
        expect(worker.dateTime).to.be.a('number');
        expect(worker.tags).to.be.an('array');
        worker.tags.forEach(tag => expect(tag).to.be.a('string'));
    }  
};
