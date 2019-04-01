const server = require('./slack_bot');

 server.listen(3000, () => {
  console.log('Server ready to go.');
});
