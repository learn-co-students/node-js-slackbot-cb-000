
const isValidToken = (token) => {
  return TOKEN == token;
}

const getGitHubUser = (username) => {
  const options = {
    uri: `https://api.github.com/users/${username}`,
    headers: { 'User-Agent': 'Slackbot-lab'}
  };

  return rp(options);
}

const prepResponse = (info, paramToGet) => {
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

// Just an example request to get you started..
app.get('/', (req, res) => {
  res.send('ok');
});

app.post('/', (req, res) => {
  if (!isValidToken(req.body.token)) {
    res.status(400).send('Sorry Invalid Token');
    return;
  }
  if (!req.body.text) {
    res.status(400).send({
      response_type: 'ephemeral',
      text: "Please specify a user to find"
    });
    return;
  }

  const requestText = req.body.text.split(' ');
  const username = requestText[0];
  const paramToGet = requestText[1];
  getGitHubUser(username)
    .then((resp) => {
      const result = JSON.parse(resp);
      res.send(prepResponse(result, paramToGet));
    }).catch((err) => {
      res.status(err.statusCode).send("Something happened")
    });
});
