const Game = require('./models/game.js');
const randomize = require('randomatic');
const NUMBER = 1;

const hasFields = (...fields) => {
  return (req, res, next) => {
    if (fields.every(field => field in req.body)) {
      return next();
    }
    res.statusCode = 400;
    res.send('Bad Request');
  };
};

const placeATile = function(req, res){
  const {tile} = req.body;
  const {playerId} = req.player;
  req.game.placeATile(tile);
  res.json(req.game.getStatus(playerId));
};

const getGameStatus = function(req, res) {
  const {playerId} = req.player;
  req.game.setCurrentPlayerStatus();
  res.json(req.game.getStatus(playerId));
};

const addPlayer = function(req, res, game, sessions) {
  const {gameId, name} = req.body;
  const id = getPlayerId();
  const sessionId = generateSessionId(sessions);
  game.addPlayer(id, name);
  sessions[sessionId] = { gameId, playerId: id, location: '/wait.html' };
  res.cookie('sessionId', sessionId).json({ isAnyError: false });
};

const joinGame = function(req, res) {
  const { gameId } = req.body;
  const { games, sessions } = req.app.locals;
  const game = games[gameId];
  if (!game) {
    return res.json({ isAnyError: true, msg: 'Invalid game id' });
  }
  if (game.hasAllPlayerJoined()) {
    return res.json({ isAnyError: true, msg: 'The game already started' });
  }
  addPlayer(req, res, game, sessions);
};

const getReferer = ({referer}) => referer && referer.split('game')[NUMBER];

const redirectToLocation = function(req, res, next) {
  if (!req.player) {
    return res.redirect('/');
  }
  const location = getReferer(req.headers);
  if (req.player.location === req.url || req.player.location === location) {
    return next();
  }
  res.redirect('wait.html');
};

const redirectToGame = function(req, res, next) {
  if (req.player) {
    return res.redirect(`/game${req.player.location}`);
  }
  next();
};

const findPlayerWithGame = function(req, res, next) {
  const { sessions, games } = req.app.locals;
  const { sessionId } = req.cookies;
  if (sessionId && sessions[sessionId]) {
    req.player = sessions[sessionId];
    req.game = games[req.player.gameId];
  }
  return next();
};

const generateSessionId = function(sessions) {
  const sessionsIdDigit = 10;
  const sessionId = randomize('*', sessionsIdDigit);
  if (sessionId in sessions) {
    return generateGameId(sessions);
  }
  return sessionId;
};

const generateGameId = function(games) {
  const gameIdDigit = 4;
  const gameId = randomize('A0', gameIdDigit);
  if (gameId in games) {
    return generateGameId(games);
  }
  return gameId;
};

const generateSequence = function() {
  let num = 0;
  return () => ++num;
};

const getPlayerId = generateSequence();

const createGame = function(req, res) {
  const { name, noOfPlayers } = req.body;
  const { sessions, games } = req.app.locals;
  const gameId = generateGameId(games);
  
  const sessionId = generateSessionId(sessions);
  const id = getPlayerId();
  games[gameId] = new Game(gameId, +noOfPlayers);
  games[gameId].addPlayer(id, name);
  sessions[sessionId] = { gameId, 'playerId': id, location: '/wait.html' };
  res.cookie('sessionId', sessionId);
  res.redirect('game/wait.html');
};

const serveGameIdAndPlayers = function(req, res) {
  if(req.game.noOfPlayers === req.game.players.length) {
    req.player.location = '/play.html';
    return res.json({isJoined: true});
  }
  res.json({isJoined: false, gameId: req.player.gameId});
};

module.exports = {
  joinGame,
  getGameStatus,
  redirectToGame,
  redirectToLocation,
  findPlayerWithGame,
  createGame,
  hasFields,
  placeATile,
  serveGameIdAndPlayers
};
