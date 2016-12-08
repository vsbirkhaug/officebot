let builder = require('botbuilder');
let dialogs = require('./dialogs');
let router = require('./router');
let express = require('express');
let server = express();

// Create connector and bot
let connector = new builder.ChatConnector({
    appId: process.env.APP_ID,
    appPassword: process.env.APP_PASS,
});
let bot = new builder.UniversalBot(connector);

// Add LUIS as an intent model
let model = process.env.LUIS_MODEL;
let recognizer = new builder.LuisRecognizer(model);
let intent = new builder.IntentDialog({recognizers: [recognizer]});

// Initialise dialogs and routes
dialogs.init(bot);
router.init(bot, intent);

module.exports = connector;
