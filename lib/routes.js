const express = require('express');
const cookieParser = require('cookie-parser');
const {joinGame, getGameStatus} = require('./handlers');

const app = express();

app.locals.games = {1234: {noOfPlayers: 3, players: []}};

const log = (req, res, next) => {
  console.log(req.method, req.url);
  next();
};

app.use(log);
app.use(express.urlencoded({extended: true}));
app.use(express.json());
app.use(cookieParser());
app.use(express.static('public'));
app.get('/update', getGameStatus);
app.post('/joingame', joinGame);

module.exports = {app};
