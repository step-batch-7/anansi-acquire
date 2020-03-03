const express = require('express');

const app = express();

const log = (req, res, next) => {
  console.log(req.method, req.url);
  next();
};

app.use(log);
app.get('/', (req, res) => res.send('Acquire, the game.'));

module.exports = {app};
