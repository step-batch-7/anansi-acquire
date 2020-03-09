const express = require('express');
const {
  redirectToLocation,
  hasFields, 
  serveGameIdAndPlayers,
  placeATile,
  getGameStatus, 
} = require('./handlers');

const gameRouter = express();
gameRouter.use(redirectToLocation);
gameRouter.use(express.static('private'));
gameRouter.get('/wait', serveGameIdAndPlayers);
gameRouter.get('/update', getGameStatus);
gameRouter.post('/placeTile', hasFields('tile'), placeATile);

module.exports = {gameRouter};
