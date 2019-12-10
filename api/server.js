const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const jwt = require('jsonwebtoken');

const usersRouter = require('../routes-models/users-router');

const server = express();

server.use(helmet());
server.use(express.json());
server.use(cors());

server.use('/api/users', usersRouter);

server.get('/', (req, res) => {
  res.send("It's alive!");
});


// test endpoint to get a token
server.get('/token', (req, res) => {
  // get a token
  // return it
  const payload = {
    subject: 'authorisation',
    exp: Math.floor(Date.now() / 1000) + (60 * 60),
    // exp: '1h',
  };
  const token = jwt.sign(payload, 'shhhhh this is just a test');
  res.send(token);
})

module.exports = server;
