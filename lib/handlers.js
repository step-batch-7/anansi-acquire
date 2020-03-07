const Game = require('./models/game.js');

const getGameStatus = function(req, res){
  const game = new Game('1', '3', []);
  res.json(game.getStatus());
};

const sessions = {};

const joinGame = function(req, res) {
  const {gameId} = req.body;
  const {games} = req.app.locals;
  const game = games[gameId];
  if (!game) {
    return res.json({isAnyError: true, msg: 'Invalid game id'});
  }
  if (game.noOfPlayers === game.players.length) {
    return res.json({isAnyError: true, msg: 'The game already started'});
  }
  sessions['1'] = {gameId: 1234, location: '/wait.html'};
  res.cookie('sessionId', '1');
  res.json({isAnyError: false});
};

const redirectToLocation = function(req, res, next) {
  const {sessionId} = req.cookies;
  if(sessionId) {
    const details = sessions[sessionId];
    if(details.location === req.url) {
      return next();
    }
    return res.redirect(`/game${details.location}`);
  }
  res.redirect('/');
};

const redirectToGame = function(req, res, next) {
  const {sessionId} = req.cookies;
  if(sessionId) {
    const details = sessions[sessionId];
    if(details) {
      return res.redirect(`/game${details.location}`);
    }
  }
  next();
};

module.exports = {joinGame, getGameStatus, redirectToGame, redirectToLocation};
