"use strict";

const rp = require('request-promise');
const express = require('express');
const bodyParser = require('body-parser');
const fetch = require('isomorphic-fetch');
const app = express();

app.use(bodyParser.urlencoded({ extended: true }));

const TOKEN = '8cVJhp6TA0fU1gEsFawEussX';

// Just an example request to get you started..
app.get('/', (req, res) => {
  res.send('Hello, World!');
});

app.post('/', (req, res) => {
  if(req.body.token !== TOKEN) {
    res.status(400).send('There was an issue.');
    return;
  }
  if(!req.body.text) res.status(400).send('Missing username. Please try again.'); return;
  const [username, secondArg] = req.body.text.split(' ');
  fetch(`https://api.github.com/users/${username}`)
    .then(response => response.json())
    .then(result => {
      if (secondArg) {
        res.send({
          text: `*${result.login}:* ${result[secondArg]}`,
          username: 'Ya Boy',
          mrkdwn: true
        });
      } else {
        res.send({
          text: `*${result.login}:* ${result.bio}. View: ${result.url}`,
          username: 'Ya Boy',
          mrkdwn: true
        });
      }
    })
    .catch(error => res.status(400).send('Could not find the user.'))
});


// This code "exports" a function 'listen` that can be used to start
// our server on the specified port.
exports.listen = function(port, callback) {
  callback = (typeof callback != 'undefined') ? callback : () => {
    console.log('Listening on ' + port + '...');
  };
  app.listen(port, callback);
};
