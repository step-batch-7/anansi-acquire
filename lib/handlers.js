const Game = require('./models/game.js');

const getGameStatus = function(req, res){
  const game = new Game('1', '3', []);
  res.json(game.getStatus());
};

module.exports = {getGameStatus};
