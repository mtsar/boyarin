"use strict";

const marked = require('marked');

const descriptionError = {
    "task-single-no-answer": "Необходимо выбрать один из ответов.",
    "answer-not-in-task": "Указан недопустимый вариант ответа.",
    "answer-duplicate": null
};

module.exports = { 
    prepareTasksList: function(tasksList, answers) {
        if(!tasksList) return null;
        
        return Object.assign({}, 
            tasksList, 
            {tasks: tasksList.tasks.map(prepareTask)});

        function prepareTask(task) {
            return Object.assign({}, task, {
                description: marked(task.description),
                multiple: task.type === 'multiple',
                answers: task.answers.map(answer => { 
                    return {value: answer, 
                        checked: (tryGetAnswer(task.id) || []).indexOf(answer) !== -1,
                        title: {"0": "не связаны", "1": "связаны"}[answer], // for russe
                    }; 
                }),
                first: task.tags[0], // for russe
                second: task.tags[1], // for russe
            });       
        }

        function tryGetAnswer(taskId) {
            return answers && answers[taskId.toString()];
        }
    },

    localizeValidationErrors: function(errors) {
        return (errors || []).map(e => (e.match(/^#(.+?):/) || [])[1])
                             .map(id => descriptionError[id] || null)
                             .filter(description => !!description);
    }
};
