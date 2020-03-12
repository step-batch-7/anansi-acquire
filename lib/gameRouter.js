const express = require('express');
const {
  redirectToLocation,
  hasFields, 
  serveWaitStatus,
  serveWaitingPage,
  placeATile,
  getGameStatus,
  establish,
  skip
} = require('./handlers');

const gameRouter = express();
gameRouter.use(redirectToLocation);
gameRouter.use(express.static('private'));
gameRouter.get('/waiting', serveWaitingPage);
gameRouter.get('/wait', serveWaitStatus);
gameRouter.get('/update', getGameStatus);
gameRouter.post('/skip', hasFields('action'), skip);
gameRouter.post('/placeTile', hasFields('tile'), placeATile);
gameRouter.post('/establish', hasFields('tile', 'corporation'), establish);

module.exports = {gameRouter};
