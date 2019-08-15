"use strict";

const rp = require('request-promise');
const express = require('express');
const bodyParser = require('body-parser');
const app = express();

//const TOKEN = 'JvBzhQ4Sd07vnG3NWn8HW7Xp';

const TOKEN = '8cVJhp6TA0fU1gEsFawEussX';

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

var options = {
  headers:{
    'User-Agent':'MarcusSimon'
  }
};
// Just an example request to get you started..
app.get('/', (req, res) => {
  res.send('Hello, World!');
});

app.post('/',(req,res) => {
  if (req.body.token !== TOKEN)
  {
    res.status(400).send();
    return;
  }
  let type = "";

  if (req.body.text) {
    const searchArg = req.body.text.split(' ');
    let username = "";
    if (searchArg.length === 2) {
      username = searchArg[0];
      type = searchArg[1];
    } else {
      username = req.body.text;
    }
    options.uri = 'https://api.github.com/users/'+username;
  }else{
    res.status(400).send({"response_type":"ephemeral","text":"Please set username to look up"});
    return;
  }
  rp(options)
    .then(function(user){
      const userInfo = JSON.parse(user);
      let userInformation = "";
      if (type !== "") {
        userInformation = "User login: "+userInfo.login+"\nUser URL: "+userInfo.html_url+"\n"+userInfo[type];
      } else {
        userInformation = "User login: "+userInfo.login+"\nUser URL: "+userInfo.html_url;
      }
      res.send({"response_type":"ephemeral","mrkdwn":true,"text":userInformation});
    })
    .catch(function(err){
      res.status(404).send({"response_type":"ephemeral","text":"Cannot find specified user"});
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
