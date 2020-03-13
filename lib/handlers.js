const fs = require('fs');
const Game = require('./models/game.js');
const NUMBER = 1;

const waitPage = fs.readFileSync('./private/wait.html', 'utf8');

const hasFields = (...fields) => {
  return (req, res, next) => {
    if (fields.every(field => field in req.body)) {
      return next();
    }
    res.statusCode = 400;
    res.send('Bad Request');
  };
};

const serveStartGame = function(req, res) {
  if (req.game.hasAllPlayerJoined() && !req.game.hasStarted) {
    req.game.start();
  }
  req.player.location = '/play.html';
  res.redirect('play.html');
};

const placeATile = function(req, res, next) {
  const {tile} = req.body;
  if (req.game.placeATile(tile, req.player.playerId)) {
    return res.json(req.game.getStatus(req.player.playerId));
  }
  next();
};

const establishCorporation = function(req, res, next) {
  const {tile, corporation} = req.body;
  if (req.game.establishCorporation(tile, corporation, req.player.playerId)) {
    return res.json(req.game.getStatus(req.player.playerId));
  }
  next();
};

const getGameStatus = function(req, res) {
  const {playerId} = req.player;
  res.json(req.game.getStatus(playerId));
};

const addPlayer = function(req, res, game, sessions) {
  const {gameId, name} = req.body;
  const id = getPlayerId();
  const sessionId = generateSessionId(sessions);
  game.addPlayer(id, name);
  sessions[sessionId] = {gameId, playerId: id, location: '/waiting'};
  res.cookie('sessionId', sessionId).json({isAnyError: false});
};

const joinGame = function(req, res) {
  const {gameId} = req.body;
  const {games, sessions} = req.app.locals;
  const game = games[gameId];
  if (!game) {
    return res.json({isAnyError: true, msg: 'Invalid game id'});
  }
  if (game.hasAllPlayerJoined()) {
    return res.json({isAnyError: true, msg: 'The game has already started'});
  }
  addPlayer(req, res, game, sessions);
};

const getReferer = ({referer}) => referer && referer.split('game')[NUMBER];

const redirectToPlayerLocation = function(req, res, next) {
  if (!req.player) {
    return res.redirect('/');
  }
  const location = getReferer(req.headers);
  if (req.player.location === req.url || req.player.location === location) {
    return next();
  }
  res.redirect(`/game${req.player.location}`);
};

const redirectToGame = function(req, res, next) {
  if (req.player) {
    return res.redirect(`/game${req.player.location}`);
  }
  next();
};

const findPlayerWithGame = function(req, res, next) {
  const {sessions, games} = req.app.locals;
  const {sessionId} = req.cookies;
  if (sessionId && sessions[sessionId]) {
    req.player = sessions[sessionId];
    req.game = games[req.player.gameId];
  }
  return next();
};

const generateSequence = function(num) {
  let initialNum = num;
  return () => ++initialNum;
};

const initialPlayerId = 0;
const initialGameID = 1234;
const generateGameId = generateSequence(initialGameID);
const generateSessionId = generateSequence(new Date().getTime());
const getPlayerId = generateSequence(initialPlayerId);

const createGame = function(req, res) {
  const {name, noOfPlayers} = req.body;
  const {sessions, games} = req.app.locals;
  const gameId = generateGameId(games);
  const sessionId = generateSessionId(sessions);
  const id = getPlayerId();
  games[gameId] = new Game(gameId, +noOfPlayers);
  games[gameId].addPlayer(id, name);
  sessions[sessionId] = {gameId, playerId: id, location: '/waiting'};
  res.cookie('sessionId', sessionId);
  res.redirect('game/waiting');
};

const skipAction = function(req, res) {
  const playerId = req.player.playerId;
  req.game.changePlayerTurn();
  res.json(req.game.getStatus(playerId));
};

const serveWaitStatus = function(req, res) {
  const hasJoined = req.game.hasAllPlayerJoined();
  const [, ...joined] = req.game.getPlayerNames();
  const remaining = req.game.requiredPlayers - req.game.getPlayerNames().length;
  res.json({hasJoined, joined, remaining});
};

const serveWaitingPage = function(req, res) {
  const waitingHtml = waitPage.replace('GAME_ID', req.player.gameId);
  const [hosted] = req.game.getPlayerNames();
  res.send(waitingHtml.replace('HOSTED', hosted));
};

module.exports = {
  joinGame,
  getGameStatus,
  redirectToGame,
  redirectToPlayerLocation,
  findPlayerWithGame,
  createGame,
  hasFields,
  serveStartGame,
  placeATile,
  serveWaitStatus,
  serveWaitingPage,
  establishCorporation,
  skipAction
};
