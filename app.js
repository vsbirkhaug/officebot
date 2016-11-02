let builder = require('botbuilder');
let restify = require('restify');

// Create bot and chat connector
let connector = new builder.ChatConnector({
    appId: process.env.APP_ID,
    appPassword: process.env.APP_PASS,
});
let bot = new builder.UniversalBot(connector);

// Create restify server
let server = restify.createServer();
server.use(restify.queryParser());
// Initialise web routes
require('./web_server/router.js')(server, bot);
server.post('/api/messages', connector.listen());

/*
 * Set up bot and dialogs
 * */
// Create a new universal bot connected to the BotConnector

// Add LUIS as an intent model
let model = process.env.LUIS_MODEL;
let recognizer = new builder.LuisRecognizer(model);
let intent = new builder.IntentDialog({recognizers: [recognizer]});
require('./bot/router.js')(bot, intent);
require('./bot/dialogs.js')(bot, builder);

// Set the http server to listen
server.listen(80, function() {
   console.log('Listening on:', 80);
});
