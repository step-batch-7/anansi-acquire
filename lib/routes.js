const express = require('express');
const cookieParser = require('cookie-parser');
const {gameRouter} = require('./gameRouter');
const {joinGame, getGameStatus, redirectToGame} = require('./handlers');

const app = express();

app.locals.games = {1234: {noOfPlayers: 3, players: []}};

const log = (req, res, next) => {
  console.log(req.method, req.url);
  next();
};

app.use(log);
app.use(express.json());
app.use(cookieParser());
app.get([/\/$/, '/hostPage.html', '/join.html'], redirectToGame);
app.use(express.urlencoded({extended: true}));
app.use('/game', gameRouter);
app.use(express.static('public'));
app.get('/update', getGameStatus);
app.post('/joingame', joinGame);

module.exports = {app};
