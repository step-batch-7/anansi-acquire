const request = require('supertest');
const { app } = require('../lib/routes');

describe('GET', () => {
  it('Should get the index.html for "/" path', (done) => {
    request(app)
      .get('/')
      .set('Accept', '*/*')
      .expect(200)
      .expect('Content-Type', /text\/html/)
      .expect(/acquire/, done);
  });

  it('should get the index.css for "/css/index.css" path', done => {
    request(app)
      .get('/css/index.css')
      .set('accept', '*/*')
      .expect(200)
      .expect('Content-Type', /text\/css/)
      .expect(/body {/, done);
  });
});
