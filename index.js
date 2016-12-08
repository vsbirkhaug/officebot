let express = require('express');
let botConnector = require('./bot');
let server = express();

// Mount the bot on the server
server.post('/api/messages', botConnector.listen());

// Set the http server to listen
server.listen(80, function() {
   console.log('Listening on:', 80);
});