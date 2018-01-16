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
   }



       getGitUser(req.body.user_name).then(function(data){

        console.log(data)
        res.send(data.login);

      }).then(null, (err) =>{
        console.log("error: ", err);
      });
        




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
/*
function getGitUser(user){

    let deferred = Promise.defer();
  let options = {
    uri: `https://api.github.com/users/${user}`,
    method: 'GET',
    json: true,
    headers: {
      'User-Agent': 'Request-Promise'
    }
  }

  rp(options).then(function(data){ //JSON object returned
    deferred.resolve(data);
  }).catch(function(err){

    deferred.resolve(err);
  });
  return deferred.promise;

}*/
