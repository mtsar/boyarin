'use strict';

let config = require('../config');
let connector = require('../connector')("MTsarConnector", config);
let is = require('./is');
let expect = require('expect.js');

describe('MTsarConnector', function() {

    it("Получать коллекцию этапов", (done)=>{
        connector.getStages((err, stages) => {
            expect(err).to.be(null);
            stages.forEach(stage => is.stage(stage));
            done();
        });
    });
   
    
    it('Получать этап по id', function(done) {
        connector.getStage("test", (err, stage) => {
            expect(err).to.be(null);
            is.stage(stage);
            done();
        });
    });

    it('Получать .undefined если не нашлось этапа', function(done){
        connector.getStage("unreal", (err, stage) => {
            expect(err).to.be(null);
            expect(stage).to.be(undefined);
            done();
        });
    });

    it('Получать worker по этапу и тегу', function(done) {
        connector.getWorker("test", "boyarin-test", (err, worker) => {
            is.worker(worker);
            expect(worker.tags).to.contain("boyarin-test");
            done();
        });
    });

    
    it('Получать undefined если не нашлось работника', function(done) {
        connector.getWorker("test", "unreal", (err, worker) => {    
            expect(err).to.be(null);
            expect(worker).to.be(undefined);
            done();
        });
    });

    it('Получать undefined если не нашлось этапа', function(done) {
        connector.getWorker("unreal", "unreal", (err, worker) => {    
            expect(err).to.be(null);
            expect(worker).to.be(undefined);
            done();
        });
    });
        
    it('Создавать нового работника', function(done) {
        let tag = [0, 1, 2, 3, 4, 5, 6].map(a => "qwertyuiop".charAt(Math.floor(Math.random()*7.9)))
                           .join("");

        connector.createWorker("test", tag, (err, worker) => {
            expect(err).to.be(null);
            is.worker(worker);
            expect(worker.tags).to.contain(tag);
            done();
        });
    });

    it('Присылать undefined на несуществующий процесс', function(done) {
        let tag = [0, 1, 2, 3, 4, 5, 6].map(a => "qwertyuiop".charAt(Math.floor(Math.random()*7.9)))
                           .join("");

        connector.createWorker("unreal", tag, (err, worker) => {
            expect(err).to.be(null);
            expect(worker).to.be(undefined);
            done();
        });
    });

    
    it('Получать список заданий', function(done) {
        connector.getTasks("test", 21, 5, (err, taskList) => {
            expect(err).to.be(null);
            is.taskList(taskList, 5);
            done();
        });
    });
        
    it("Получать задания по Id", function(done){
        connector.getTasksById("test", 21, [52, 77], (err, taskList) => {
            expect(err).to.be(null);
            is.taskList(taskList, 2);
            taskList.tasks.forEach(task => expect([52, 77]).to.contain(task.id));
            done();           
        });
    }); 

    it.skip("Отправка задания", function(done) {
        connector.getWorker("test", "boyarin-test", (err, worker)=> {
            connector.getTasks("test", worker.id, 1, (err, taskList) => {
                const task = taskList.tasks[0];
                let answers = {};
                answers[`${task.id}`] = [task.answers[0]]; 
                let data = { answers: answers, tags: `tasks${task.id}`};
                connector.sendAnswers("test", worker.id, data, (err, errors) => {
                    expect(err).to.be(null);
                    expect(errors).to.be(undefined);

                    connector.getTasks("test", worker.id, 1, (err, taskList2) => {
                        expect(taskList2.taskRemaining + 1).to.be(taskList.taskRemaining);
                        done();
                    });
                });
            });
        });
    });
});
