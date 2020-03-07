const express = require('express');
const {redirectToLocation} = require('./handlers');

const gameRouter = express();
gameRouter.use(redirectToLocation);
gameRouter.use(express.static('private'));

module.exports = {gameRouter};
