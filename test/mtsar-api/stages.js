'use strict';

let config = require('../../config');
let request = require('request');
let expect = require('expect.js');

function expectStage(stage) {
    expect(stage).to.have.keys(['id', 'description', 'options']);
    expect(stage.id).to.be.a('string');
    expect(stage.description).to.be.a('string');
    expect(stage.options).to.be.an('object');
}

describe.skip('mtsar /stages api', function() {

    it('GET /stages - list of stages', function(done) {
        let url = `${config.apiURL}/stages`;
        request.get(url, function(error, response, body) {
            expect(body).to.be.an('array');
            body.forEach(stage => expectStage(stage));

            done(error); 
        }).json();
    });

    it('GET /stages/{stage id} - stage description', function(done) {
        let url = `${config.apiURL}/stages/test`;
    
        request.get(url, function(error, response, body) {
            expectStage(body);
            done(error); 
        }).json();
    });  
});
