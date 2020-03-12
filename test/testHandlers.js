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

  describe('/host.html', () => {
    it('Should give host.html for /host.html', done => {
      request(app)
        .get('/host.html')
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
    it('should direct to / if not joined user access /game/waiting', done => {
      request(app)
        .get('/game/waiting')
        .expect(302)
        .expect('Location', '/', done);
    });

    it('should direct to / for not joined user access "/game"', done => {
      request(app)
        .get('/game')
        .expect(302)
        .expect('Location', '/', done);
    });

    it('should give waiting if waiting user access /game/waiting', done => {
      app.locals.sessions = {
        2: {gameId: 1, playerId: 3, location: '/waiting'}
      };
      app.locals.games = {1: {getPlayerNames: () => ['ram']}};
      request(app)
        .get('/game/waiting')
        .set('Cookie', 'sessionId=2')
        .expect(200)
        .expect('Content-Type', /html/, done);
    });

    it('should direct to /game/waiting for waiting user access /game', done => {
      app.locals.sessions = {
        2: {gameId: 1, playerId: 3, location: '/waiting'}
      };
      app.locals.games = {1: {getPlayerNames: () => ['ram']}};
      request(app)
        .get('/game')
        .set('Cookie', 'sessionId=2')
        .expect(302)
        .expect('Location', '/game/waiting', done);
    });

    it('should direct to /game/waiting for waiting user access /', done => {
      app.locals.sessions = {
        2: {gameId: 1, playerId: 3, location: '/waiting'}
      };
      request(app)
        .get('/')
        .set('Cookie', 'sessionId=2')
        .expect(302)
        .expect('Location', '/game/waiting', done);
    });

    it('should direct to /game/waiting waiting user access /join', done => {
      app.locals.sessions = {
        2: {gameId: 1, playerId: 3, location: '/waiting'}
      };
      request(app)
        .get('/join.html')
        .set('Cookie', 'sessionId=2')
        .expect(302)
        .expect('Location', '/game/waiting', done);
    });
  });
  
  describe('/game/waiting', () => {
    it('should give waiting page for hosted user in /game/waiting', done => {
      app.locals.sessions = {
        2: {gameId: 1441, playerId: 3, location: '/waiting'}
      };
      app.locals.games = {1441: {getPlayerNames: () => ['ram']}};
      request(app)
        .get('/game/waiting')
        .set('Cookie', 'sessionId=2')
        .expect(200)
        .expect(/1441/, done);
    });
  });
  it('should give the hasJoined false if all players join /game/wait', done => {
    app.locals.sessions = {
      2: {gameId: 1441, playerId: 3, location: '/waiting'}
    };
    app.locals.games = {
      1441: {
        getPlayerNames: () => ['ram'],
        hasAllPlayerJoined: () => false,
        requiredPlayers: 3
      }
    };
    const expected = {hasJoined: false, joined: [], remaining: 2};
    request(app)
      .get('/game/wait')
      .set('Cookie', 'sessionId=2')
      .set('referer', 'game/waiting')
      .expect(200)
      .expect(JSON.stringify(expected), done);
  });

  it('should give the hasJoined true if all players join /game/wait', done => {
    app.locals.sessions = {
      2: {gameId: 1441, playerId: 3, location: '/waiting'}
    };
    app.locals.games = {
      1441: {
        getPlayerNames: () => ['ram', 'anu', 'sid'],
        hasAllPlayerJoined: () => true,
        requiredPlayers: 3
      }
    };
    const expected = {hasJoined: true, joined: ['anu', 'sid'], remaining: 0};
    request(app)
      .get('/game/wait')
      .set('Cookie', 'sessionId=2')
      .set('referer', 'game/waiting')
      .expect(200)
      .expect(JSON.stringify(expected), done);
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
    it('should give isAnyError false for valid game id', done => {
      const body = JSON.stringify({name: 'john', gameId: '1234'});
      const expected = {isAnyError: false};
      const expectedJson = JSON.stringify(expected);
      app.locals.games = {
        1234: {hasAllPlayerJoined: () => false, addPlayer: () => {}}
      };
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
      const expected = {isAnyError: true, msg: 'The game has already started'};
      const expectedJson = JSON.stringify(expected);
      app.locals.games = {1234: {hasAllPlayerJoined: () => true}};
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

  describe('/game', () => {
    describe('/placeTile', () => {
      it('should give status when a tile is placed by current player', done => {
        app.locals.games = {123: {placeATile: () => true, getStatus: () => {
          return {status: 'status'};
        }
        }};
        app.locals.sessions = {
          2: {gameId: 123, playerId: 3, location: '/play.html'}
        };

        request(app)
          .post('/game/placeTile')
          .set('Content-Type', 'application/json')
          .set('Cookie', 'sessionId=2')
          .set('referer', 'game/play.html')
          .send({tile: '5A'})
          .expect(200, done);
      });

      it('should not give status when tile is invalid', done => {
        app.locals.games = {123: {placeATile: () => false, getStatus: () => {
          return {status: 'status'};
        }
        }};
        app.locals.sessions = {
          2: {gameId: 123, playerId: 3, location: '/play.html'}
        };

        request(app)
          .post('/game/placeTile')
          .set('Content-Type', 'application/json')
          .set('Cookie', 'sessionId=2')
          .set('referer', 'game/play.html')
          .send({tile: '5A'})
          .expect(404, done);
      });
    });
    describe('/update', () => {
      it('should give status of the particular player', done => {
        app.locals.games = {123: {getStatus: () => {
          return {status: 'status'}; 
        }}};
        app.locals.sessions = {
          2: {gameId: 123, playerId: 3, location: '/play.html'}
        };
        request(app)
          .get('/game/update')
          .set('Cookie', 'sessionId=2')
          .set('referer', 'game/play.html')
          .expect(200, done);
      });
    });

    describe('/establish', () => {
      it('should give action of the player along with status', done => {
        app.locals.games = {
          123: {
            establishCorporation: () => true,
            getStatus: () => ({status: {}, action: {}})
          }
        };
        app.locals.sessions = {
          2: {gameId: 123, playerId: 3, location: '/play.html'}
        };
        request(app)
          .post('/game/establish')
          .set('Cookie', 'sessionId=2')
          .set('Content-Type', 'application/json')
          .send(JSON.stringify({tile: 2, corporation: 'phoenix'}))
          .set('referer', 'game/play.html')
          .expect(200, done);
      });

      it('should give 404 for corporation not established', done => {
        app.locals.games = {
          123: {
            establishCorporation: () => false,
          }
        };
        app.locals.sessions = {
          2: {gameId: 123, playerId: 3, location: '/play.html'}
        };
        request(app)
          .post('/game/establish')
          .set('Cookie', 'sessionId=2')
          .set('Content-Type', 'application/json')
          .send(JSON.stringify({tile: 2, corporation: 'phoenix'}))
          .set('referer', 'game/play.html')
          .expect(404, done);
      });
    });
  });
});
