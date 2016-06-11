'use strict';

let config = require('../../config');
let request = require('request');
let expect = require('expect.js');

let testTag = 'boyarin-test';
let stageId = 'test';

function expectWorker(worker) {
    expect(worker.id).to.be.a('number');
    expect(worker.stage).to.be('test');
    expect(worker.dateTime).to.be.a('number');
    expect(worker.tags).to.be.an('array');

    worker.tags.forEach(tag => expect(tag).to.be.a('string'));
}

describe.skip('mtsar /stages/{stage}/workers api', function() {

    it('GET /stages/{stage}/workers - list of workers', function(done) {
        let url = `${config.apiURL}/stages/${stageId}/workers`;
        let options = {
            headers: {Accept: "application/json"}
        };
        request.get(url, options, function(error, response, body) {
            let workers = JSON.parse(body);
            
            expect(workers).to.be.an('array');
            workers.forEach(worker => expectWorker(worker));

            done(error); 
        });
    });

    it('GET /stages/{stage}/workers/{worker id} - worker', function(done) {
        let url = `${config.apiURL}/stages/${stageId}/workers/1`;
        request.get(url, function(error, response, body) {
            let worker = JSON.parse(body);
            
            expectWorker(worker);
          
            done(error); 
        });
    });

    it('GET /stages/{stage}/workers/tagged/{tag} - worker with the tag', function(done) {
        let url = `${config.apiURL}/stages/${stageId}/workers/tagged/${testTag}`;
        request.get(url, function(error, response, body) {
            let worker = JSON.parse(body);
            
            expectWorker(worker);
            expect(worker.tags).to.contain(testTag);
            
            done(error); 
        });
    });
});

describe.skip("Create workers", function() {

    it('POST /stages/{stage}/workers - create worker', function(done) {
        let url = `${config.apiURL}/stages/${stageId}/workers`;
        request.post(url, { form: {tags: testTag} }, function(error, response, body) {
            let worker = JSON.parse(body);
        
            expectWorker(worker);
          
            expect(worker.tags).to.contain('boyarin-test');
            done(error); 
        });
    });
});
