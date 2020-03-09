const express = require('express');
const {
  redirectToLocation,
  hasFields, 
  serveWaitStatus,
  serveWaitingPage,
  placeATile,
  getGameStatus, 
} = require('./handlers');

const gameRouter = express();
gameRouter.use(redirectToLocation);
gameRouter.use(express.static('private'));
gameRouter.get('/waiting', serveWaitingPage);
gameRouter.get('/wait', serveWaitStatus);
gameRouter.get('/update', getGameStatus);
gameRouter.post('/placeTile', hasFields('tile'), placeATile);

module.exports = {gameRouter};
