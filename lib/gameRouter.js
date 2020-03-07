const express = require('express');
const {redirectToLocation, hasFields, placeATile} = require('./handlers');

const gameRouter = express();
gameRouter.use(redirectToLocation);
gameRouter.use(express.static('private'));
gameRouter.post('/placeTile', hasFields('tile'), placeATile);

module.exports = {gameRouter};
