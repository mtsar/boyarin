'use strict';

let expect = require('expect.js');
let request = require('supertest');

describe('normal home routing', function() {
    let app = require('../../app')();

    it('GET / - Этапы разметки', function(done) {
        request(app).get('/')
                .expect('Content-Type', /text\/html/)
                .expect(200, function(err, res) {
                    expect(res.text).to.match(/Этапы разметки/);
                    done(err);
                });
    }); 

    it('GET /about - Информация', function(done){
        request(app).get('/about')
            .expect('Content-Type', /text\/html/)
            .expect(200, function(err, res) {
                expect(res.text).to.match(/Информация/);
                done(err);
            });
   });

});

describe('disabled home routing', function() {
    let app = require('../../app')({disabled: true });

    it('GET / - Обед', function(done) {
        request(app).get('/')
                .expect('Content-Type', /text\/html/)
                .expect(200, function(err, res) {
                    expect(res.text).to.match(/Обед/);
                    done(err);
                });
    }); 

    it('GET /about - Информация', function(done){
        request(app).get('/about')
            .expect('Content-Type', /text\/html/)
            .expect(200, function(err, res) {
                expect(res.text).to.match(/Информация/);
                done(err);
            });
   });

});
