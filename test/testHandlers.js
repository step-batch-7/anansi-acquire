const request = require('supertest');
const {app} = require('../lib/routes');

describe('GET', () => {
  describe('/index.html', () => {
    it('Should get the index.html for "/" path', done => {
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
  });

  describe('/hostPage.html', () => {
    it('Should give hostPage.html for /hostPage.html', done => {
      request(app)
        .get('/hostPage.html')
        .expect(200)
        .expect('Content-type', /html/)
        .expect(/No of players/, done);
    });
  });

  describe('/join.html', () => {
    it('should get the join.html for /join.html', done => {
      request(app)
        .get('/join.html')
        .expect(200)
        .expect('Content-Type', /html/, done);
    });

    it('should get the join.js for /js/join.js', done => {
      request(app)
        .get('/js/join.js')
        .expect(200)
        .expect('Content-Type', /javascript/, done);
    });
  });

  describe('/game', () => {
    it('should direct to / if not joined user access /game/wait.html', done => {
      request(app)
        .get('/game/wait.html')
        .expect(302)
        .expect('Location', '/', done);
    });

    it('should direct to / for not joined user access "/game"', done => {
      request(app)
        .get('/game')
        .expect(302)
        .expect('Location', '/', done);
    });

    it('should give wait.html if waiting user access /game/wait.html', done => {
      app.locals.sessions = {
        2: {gameId: 1, playerId: 3, location: '/wait.html'}
      };
      request(app)
        .get('/game/wait.html')
        .set('Cookie', 'sessionId=2')
        .expect(200)
        .expect('Content-Type', /html/, done);
    });

    it('should direct to /game/wait.html waiting user access /game', done => {
      app.locals.sessions = {
        2: {gameId: 1, playerId: 3, location: '/wait.html'}
      };
      request(app)
        .get('/game')
        .set('Cookie', 'sessionId=2')
        .expect(302)
        .expect('Location', '/game/wait.html', done);
    });

    it('should direct to /game/wait.html for waiting user access /', done => {
      app.locals.sessions = {
        2: {gameId: 1, playerId: 3, location: '/wait.html'}
      };
      request(app)
        .get('/')
        .set('Cookie', 'sessionId=2')
        .expect(302)
        .expect('Location', '/game/wait.html', done);
    });

    it('should direct to /game/wait.html waiting user access /join', done => {
      app.locals.sessions = {
        2: {gameId: 1, playerId: 3, location: '/wait.html'}
      };
      request(app)
        .get('/join.html')
        .set('Cookie', 'sessionId=2')
        .expect(302)
        .expect('Location', '/game/wait.html', done);
    });
  });
});

describe('POST', () => {
  describe('/hostGame', function() {
    it('should show waiting page if user enters name and playerCount', done => {
      const body = JSON.stringify({name: 'john', noOfPlayers: '3'});
      request(app)
        .post('/hostGame')
        .set('Content-Type', 'application/json')
        .send(body)
        .expect(302, done);
    });

    it('should give bad request if user enters only name', done => {
      const body = JSON.stringify({name: 'john'});
      request(app)
        .post('/hostGame')
        .set('Content-Type', 'application/json')
        .send(body)
        .expect(400)
        .expect(/Bad Request/, done);
    });

    it('should give bad request if user enters only no of players', done => {
      const body = JSON.stringify({noOfPlayers: '3'});
      request(app)
        .post('/hostGame')
        .set('Content-Type', 'application/json')
        .send(body)
        .expect(400)
        .expect(/Bad Request/, done);
    });
  });

  describe('/joinGame', () => {
    it('should isAnyError false for valid game id', done => {
      const body = JSON.stringify({name: 'john', gameId: '1234'});
      const expected = {isAnyError: false};
      const expectedJson = JSON.stringify(expected);
      app.locals.games = {1234: {noOfPlayers: 3, players: [{name: 'ram'}]}};
      request(app)
        .post('/joinGame')
        .set('Content-Type', 'application/json')
        .send(body)
        .expect(200)
        .expect(expectedJson)
        .expect('Content-Type', /json/, done);
    });

    it('should give invalid message for invalid id', done => {
      const body = JSON.stringify({name: 'john', gameId: '123456'});
      const expected = {isAnyError: true, msg: 'Invalid game id'};
      app.locals.games = {1234: {noOfPlayers: 3, players: [{name: 'ram'}]}};
      request(app)
        .post('/joinGame')
        .set('Content-Type', 'application/json')
        .send(body)
        .expect(200)
        .expect(JSON.stringify(expected))
        .expect('Content-Type', /json/, done);
    });

    it('should give Game started msg for ongoing game', done => {
      const body = JSON.stringify({name: 'john', gameId: '1234'});
      const expected = {isAnyError: true, msg: 'The game already started'};
      const expectedJson = JSON.stringify(expected);
      const players = [{name: 'ram'}, {name: 'anu'}, {name: 'sid'}];
      app.locals.games = {1234: {noOfPlayers: 3, players}};
      request(app)
        .post('/joinGame')
        .set('Content-Type', 'application/json')
        .send(body)
        .expect(200)
        .expect(expectedJson)
        .expect('Content-Type', /json/, done);
    });

    it('should give 400 bad request any field missing', done => {
      request(app)
        .post('/joinGame')
        .set('Content-Type', 'application/json')
        .send(JSON.stringify({class: 5}))
        .expect(400, done);
    });
  });
});
