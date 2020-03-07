const Game = require('./models/game.js');

const getGameStatus = function(req, res){
  const game = new Game('1', '3', []);
  res.json(game.getStatus());
};

const joinGame = function(req, res) {
  const {gameId} = req.body;
  const {games, sessions} = req.app.locals;
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
  if(!req.player) {
    return res.redirect('/');
  }
  if(req.player.location === req.url) {
    return next();
  }
  return res.redirect(`/game${req.player.location}`);
};

const redirectToGame = function(req, res, next) {
  if(req.player) {
    return res.redirect(`/game${req.player.location}`);
  }
  next();
};

const findPlayerWithDetails = function(req, res, next) {
  const {sessions} = req.app.locals;
  const {sessionId} = req.cookies;
  if(sessionId) {
    const details = sessions[sessionId];
    if(details) {
      req.player = details;
    }
  }
  return next();
};

module.exports = {
  joinGame,
  getGameStatus,
  redirectToGame,
  redirectToLocation,
  findPlayerWithDetails
};
