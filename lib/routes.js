const express = require('express');
const cookieParser = require('cookie-parser');
const { gameRouter } = require('./gameRouter');
const {
  joinGame, getGameStatus, createGame, redirectToGame, findPlayerWithDetails
} = require('./handlers');

const app = express();

app.locals.games = {};
app.locals.sessions = {};

const log = (req, res, next) => {
  console.log(req.method, req.url);
  next();
};

app.use(log);
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cookieParser());
app.use(findPlayerWithDetails);
app.get([/\/$/, '/hostPage.html', '/join.html'], redirectToGame);
app.use(express.urlencoded({ extended: true }));
app.use('/game', gameRouter);
app.use(express.static('public'));
app.get('/update', getGameStatus);
app.post('/joingame', joinGame);
app.post('/hostGame', createGame);

module.exports = { app };
