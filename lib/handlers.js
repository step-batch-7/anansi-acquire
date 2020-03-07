const Game = require('./models/game.js');
const randomize = require('randomatic');

const hasFields = (...fields) => {
  return (req, res, next) => {
    if (fields.every(field => field in req.body)) {
      return next();
    }
    res.statusCode = 400;
    res.send('Bad Request');
  };
};

const getGameStatus = function(req, res) {
  const game = new Game('1', '3', []);
  const playerId = 12;
  game.addPlayer(playerId, 'John');
  res.json(game.getStatus(playerId));
};

const addPlayer = function(req, res, game, sessions) {
  const {gameId, name} = req.body;
  const id = getPlayerId();
  const sessionId = generateSessionId(sessions);
  game.players.push({name, id});
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
  if (game.players.length === +game.noOfPlayers) {
    return res.json({ isAnyError: true, msg: 'The game already started' });
  }
  addPlayer(req, res, game, sessions);
};

const redirectToLocation = function(req, res, next) {
  if (!req.player) {
    return res.redirect('/');
  }
  if (req.player.location === req.url) {
    return next();
  }
  return res.redirect(`/game${req.player.location}`);
};

const redirectToGame = function(req, res, next) {
  if (req.player) {
    return res.redirect(`/game${req.player.location}`);
  }
  next();
};

const findPlayerWithDetails = function(req, res, next) {
  const { sessions } = req.app.locals;
  const { sessionId } = req.cookies;
  if (sessionId) {
    const details = sessions[sessionId];
    if (details) {
      req.player = details;
    }
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
  games[gameId] = { players: [{ name, id }], noOfPlayers };
  sessions[sessionId] = { gameId, 'playerId': id, location: '/wait.html' };
  res.cookie('sessionId', sessionId);
  res.redirect('game/wait.html');
};

module.exports = {
  joinGame,
  getGameStatus,
  redirectToGame,
  redirectToLocation,
  findPlayerWithDetails, createGame,
  hasFields
};
