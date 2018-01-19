/*"use strict;  my code, not sure why this doesn't work for the tests but it works in slack.

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
      res.status(400).send()
   }

   if (!req.body.text){

      res.status(400).send();
      return;
   }
   let [user, param] = req.body.text.split(" ");

     getGitUser(user).then((resp) => {








          res.send(addText(resp, param));



     }).catch((err) => {
       console.log("Why is this error happening" + err.statusCode);
       let errObj = {response_type: "ephemeral"};
       errObj.text = "User not found.";

       res.send("User not found");
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
function addText(obj,param){
  let resp = obj
  let userObj = {response_type: "ephemeral", mrkdwn: true};
  userObj.text = '*User:' + " @" + resp.login +"*"+ "\n";
  if(!param){
    userObj.text += "Url:" + " " + "<" + resp.html_url + ">" + ".";
  }else{
    userObj.text += `${param}` + ": " + resp[param];

  }

   return userObj;
}

let getGitUser = (user) => {


    let options = {
      uri: `https://api.github.com/users/${user}`,
      method: 'GET',
      json: true,
      headers: {
        'User-Agent': 'Request-Promise'
      }
    }
    return rp(options);
};*/

"use strict";

const rp = require('request-promise');
const express = require('express');
const bodyParser = require('body-parser');
const app = express();

app.use(bodyParser.urlencoded({ extended: true }));

const TOKEN = '8cVJhp6TA0fU1gEsFawEussX';

const validRequest = (token) => {
  return TOKEN == token;
};

const fetchGithubUser = (username) => {
  const url =  'https://api.github.com/users/' + username;
  return rp({
    uri: url,
    headers: {
        'User-Agent': 'Flatiron-Slackbot-Lab'
    },
  });
};

const prepareResponse = (info, paramToGet) => {
  let rv = { response_type: "ephemeral", mrkdwn: true };
  const EOL = '\n';
  rv.text = '*Github User: @' + info.login + ' (' + info.name + ')*:' + EOL;
  if (!paramToGet) {
    rv.text += '> Company: ' + info.company + EOL;
    rv.text += '> Location: ' + info.location + EOL;
    rv.text += '> Hireable: ' + info.hireable + EOL;
    rv.text += '> Githup Profile: ' + info.html_url + EOL;
  }
  else {
    rv.text += '> ' + paramToGet.charAt(0).toUpperCase() + paramToGet.slice(1) + ': ';
    rv.text += info[paramToGet];
  }
  return rv;
};

app.get('/', (req,res) => {
  res.send('ok');
});

app.post('/', (req, res) => {
  if (!validRequest(req.body.token)) {
    res.status(400).send();
    return;
  }
  if (!req.body.text) {
    res.status(400).send({
      response_type: 'ephemeral',
      text: "Please specify a user to find."
    });
    return;
  }
  const cmd = req.body.text.split(' '),
        user = cmd[0],
        paramToGet = cmd[1];
  fetchGithubUser(user).then((resp) => {
    const result = JSON.parse(resp);
    res.send(prepareResponse(result, paramToGet));
  }).catch((err) => {
    let errMsg = { response_type: "ephemeral" };
    if('statusCode' in err && err.statusCode == 404) {
      errMsg.text = "Sorry. Unable to find that user.";
      res.status(err.statusCode).send(errMsg);
    }
    else {
      const status = err.statusCode ? err.statusCode : 500;
      errMsg.text = "Oop! Something went wrong. Please try again.";
      res.status(status).send(errMsg);
    }
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
