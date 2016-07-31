"use strict";

let error = null;

let stages = [
    {id: 'test', description: 'task 1 description', options: {tasksPerPage: 4}},
    {id: 'test', description: 'task 2 description', options: {tasksPerPage: 4}},
    {id: 'test', description: 'task 3 description', options: {tasksPerPage: 4}}
];

let worker = {
    id: 123,
    tags: ["aaa"]
};

let taskList = {
    taskCount: 205,
    taskRemaining: 205,
    type: "allocation",
    worker: { id: 'fakeConnector->fakeid'},
    tasks: [
        {
            id: 1,
            description: "По *дороге* зимней, скучной // Тройка борзая бежит, // Колокольчик однозвучный // Утомительно гремит.",
            type: "multiple",
            answers: [
                "траектория", 
                "шоссе", 
                "фортель", 
                "крюк", 
                "путь", 
                "шествие", 
                "расстояние"
            ],
            tags: [],
        },
        {
            id: 2,
            description: "По *дороге* зимней, скучной // Тройка борзая бежит, // Колокольчик однозвучный // Утомительно гремит.",
            type: "single",
            answers: [
                "траектория", 
                "шоссе", 
                "фортель", 
                "крюк", 
                "путь", 
                "шествие", 
                "расстояние"
            ],
            tags: [],
        },
        {
            id: 3,
            description: "По *дороге* зимней, скучной // Тройка борзая бежит, // Колокольчик однозвучный // Утомительно гремит.",
            type: "multiple",
            answers: [
                "траектория", 
                "шоссе", 
                "фортель", 
                "крюк", 
                "путь", 
                "шествие", 
                "расстояние"
            ],
            tags: [],
        },
        {
            id: 5,
            description: "По *дороге* зимней, скучной // Тройка борзая бежит, // Колокольчик однозвучный // Утомительно гремит.",
            type: "multiple",
            answers: [
                "траектория", 
                "шоссе", 
                "фортель", 
                "крюк", 
                "путь", 
                "шествие", 
                "расстояние"
            ],
            tags: [],
        },
        {
            id: 4,
            description: "По *дороге* зимней, скучной // Тройка борзая бежит, // Колокольчик однозвучный // Утомительно гремит.",
            type: "multiple",
            answers: [
                "траектория", 
                "шоссе", 
                "фортель", 
                "крюк", 
                "путь", 
                "шествие", 
                "расстояние"
            ],
            tags: [],
        }   
    ]
};

const answersError = ["#task-single-no-answer: ...", 
                      "#answer-not-in-task: ...",
                      "#answer-duplicate: ..."];

class FakeConnector{
    getStages(callback){
        callback(error, stages);
    }    

    getStage(stageId, callback){
        callback(error, stages.find(stage => stage.id === stageId));
    }

    getWorker(stageId, workerTag, callback) {
        callback(error, worker);
    }

    createWorker(stageId, workerTag, callback) {
        callback(error, worker);
    } 

    getTasks(stageId, workerId, count, callback) {
        callback(error, taskList);
    }

    getTasksById(stageId, workerId, id, callback) {
        callback(error, taskList);
    }

    sendAnswers(stageId, workerId, answers, callback) {
        callback(error, answersError);
    }
}

module.exports = FakeConnector;
