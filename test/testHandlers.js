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

  it('should get the index.css for "css/index.css" path', done => {
    request(app)
      .get('/css/index.css')
      .set('accept', '*/*')
      .expect(200)
      .expect('Content-Type', /text\/css/)
      .expect(/body {/, done);
  });

  it('should get the join.html for /join.html', done => {
    request(app)
      .get('/join.html')
      .expect(200)
      .expect('Content-Type', /html/, done);
  });

  it('Should give hostPage.html for /hostPage.html', (done) => {
    request(app)
      .get('/hostPage.html')
      .expect(200)
      .expect('Content-type', /html/)
      .expect(/No of players/, done);
  });

  it('should get the join.js for /js/join.js', done => {
    request(app)
      .get('/js/join.js')
      .expect(200)
      .expect('Content-Type', /javascript/, done);
  });
});

describe('POST', () => {

  describe('/hostGame', function() {
    it('should show waiting page if user enters name and playerCount', done => {
      const body = JSON.stringify({ name: 'john', noOfPlayers: '3' });
      request(app)
        .post('/hostGame')
        .set('Content-Type', 'application/json')
        .send(body)
        .expect(302, done);
    });
  });

  describe('/joinGame', () => {
    it('should give Game id for valid game id for path /joingame', done => {
      const body = JSON.stringify({ name: 'john', gameId: '1234' });
      const expected = { isAnyError: false };
      const expectedJson = JSON.stringify(expected);
      app.locals.games = { 1234: { noOfPlayers: 3, players: ['ram'] } };
      request(app)
        .post('/joingame')
        .set('Content-Type', 'application/json')
        .send(body)
        .expect(200)
        .expect(expectedJson)
        .expect('Content-Type', /json/, done);
    });
  });

  it('should give invalid message for invalid id for /joingame', done => {
    const body = JSON.stringify({ name: 'john', gameId: '123456' });
    const expected = { isAnyError: true, msg: 'Invalid game id' };
    app.locals.games = { 1234: { noOfPlayers: 3, players: ['ram'] } };
    request(app)
      .post('/joingame')
      .set('Content-Type', 'application/json')
      .send(body)
      .expect(200)
      .expect(JSON.stringify(expected))
      .expect('Content-Type', /json/, done);
  });

  it('should give Game started msg for ongoing game for /joingame', done => {
    const body = JSON.stringify({ name: 'john', gameId: '1234' });
    const expected = { isAnyError: true, msg: 'The game already started' };
    const expectedJson = JSON.stringify(expected);
    const players = ['ram', 'anu', 'sid'];
    app.locals.games = { 1234: { noOfPlayers: 3, players } };
    request(app)
      .post('/joingame')
      .set('Content-Type', 'application/json')
      .send(body)
      .expect(200)
      .expect(expectedJson)
      .expect('Content-Type', /json/, done);
  });
});
