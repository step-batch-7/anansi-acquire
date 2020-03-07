const express = require('express');
const cookieParser = require('cookie-parser');
const{getGameStatus} = require('./handlers');

const app = express();

app.locals.game = {};

const log = (req, res, next) => {
  console.log(req.method, req.url);
  next();
};

app.use(log);
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static('public'));
app.get('/update', getGameStatus);

module.exports = { app };
