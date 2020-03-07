const Game = require('./models/game.js');

const getGameStatus = function(req, res){
  const game = new Game('1', '3', []);
  res.json(game.getStatus());
};

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
  res.send({isAnyError: false, msg: `Game id: ${gameId}`});
};

module.exports = {joinGame, getGameStatus};
