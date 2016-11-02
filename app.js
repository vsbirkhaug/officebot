var builder = require('botbuilder'),
    restify = require('restify'),
    request = require('request');

// Create bot and chat connector
var connector = new builder.ChatConnector({
    appId: process.env.APP_ID,
    appPassword: process.env.APP_PASS
});
var bot = new builder.UniversalBot(connector);

// Create restify server
var server = restify.createServer();
server.use(restify.queryParser());
// Initialise web routes
require("./http_routes.js")(server, bot);
server.post("/api/messages", connector.listen());

/*
 * Set up bot and dialogs
 * */
// Create a new universal bot connected to the BotConnector

// Add LUIS as an intent model
var model = process.env.LUIS_MODEL;
var recognizer = new builder.LuisRecognizer(model);
var intent = new builder.IntentDialog({ recognizers: [recognizer] });
require("./intents_router.js")(bot, intent);
require("./dialogs.js")(bot, builder);

// Set the http server to listen
server.listen(80, function() {
   console.log("Listening on:", 80);
});