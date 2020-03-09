const express = require('express');
const {
  redirectToLocation,
  hasFields, placeATile,
  serveGameIdAndPlayers
} = require('./handlers');

const gameRouter = express();
gameRouter.use(redirectToLocation);
gameRouter.use(express.static('private'));
gameRouter.get('/wait', serveGameIdAndPlayers);
gameRouter.post('/placeTile', hasFields('tile'), placeATile);

module.exports = {gameRouter};
