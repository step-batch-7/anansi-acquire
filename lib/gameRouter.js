const express = require('express');
const {
  redirectToPlayerLocation,
  hasFields,
  serveWaitStatus,
  serveWaitingPage,
  serveStartGame,
  placeATile,
  getGameStatus,
  establishCorporation,
  skipAction,
  buyStocks
} = require('./handlers');

const gameRouter = express();
gameRouter.use(redirectToPlayerLocation);
gameRouter.use(express.static('private'));
gameRouter.get('/waiting', serveWaitingPage);
gameRouter.get('/wait', serveWaitStatus);
gameRouter.get('/start', serveStartGame);
gameRouter.get('/update', getGameStatus);
gameRouter.post('/skip', hasFields('action'), skipAction);
gameRouter.post('/placeTile', hasFields('tile'), placeATile);
gameRouter.post(
  '/establish',
  hasFields('tile', 'corporation'),
  establishCorporation
);
gameRouter.post('/buyStocks', hasFields('corpsAndStocks'), buyStocks);

module.exports = { gameRouter };
