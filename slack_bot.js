"use strict";

const rp = require('request-promise');
const request = require('request');
const express = require('express');
const bodyParser = require('body-parser');
const app = express();
app.use(bodyParser.urlencoded({ extended: true }));
const TOKEN = '4iBkudV1iSmtmtMQDMW9mb6U';

// Just an example request to get you started..
app.get('/', (req, res) => {
  res.send('Hello, World!');
});

app.post('/',(req,res) => {

   
   if (req.body.token !== TOKEN){
     res.statusCode = 400;
      res.send();
   }else if (req.body.text === ''){
     res.statusCode = 404;
     res.send("You must enter a git username");
   }else{
     getGitUser(req.body.text).then(function(data){


      res.send(`User-name: ${data.login}, Site: ${data.blog}, Repos: ${data.public_repos}, URL: ${data.html_url}`);

    }).then(null, (err) =>{

    });


   }








});

// This code "exports" a function 'listen` that can be used to start
// our server on the specified port.
exports.listen = function(port, callback) {
  callback = (typeof callback != 'undefined') ? callback : () => {
    console.log('Listening on ' + port + '...');
  };
  app.listen(port, callback);
};


let getGitUser = (user) => {

  return new Promise((resolve, reject) => {
    let options = {
      uri: `https://api.github.com/users/${user}`,
      method: 'GET',
      json: true,
      headers: {
        'User-Agent': 'Request-Promise'
      }
    }
    request(options, (err, res, body) => {
      if (err) reject (err);
       resolve(body);
    });
  });
}
