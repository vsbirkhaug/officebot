let Promise = require('bluebird');
let builder = require('botbuilder');
let dialogs = require('./dialogs');
let express = require('express');
let entityRecognizer = require('./entityRecognizer');
let middleware = require('./middleware');
let server = express();

function init(config) {
    return new Promise(function(resolve, reject) {
        // Create connector and bot
        let connector = new builder.ChatConnector({
            appId: config.bot.id,
            appPassword: config.bot.pass,
        });
        var bot = new builder.UniversalBot(connector);

        // Add global LUIS recognizer to bot
        bot.recognizer(new builder.LuisRecognizer(config.bot.luisModel));

        // Middleware
        bot.use(middleware.mentionDetection({botName: 'officebot'}));
        bot.use(middleware.hardReset({phrase: 'convo reset'}));
        bot.use(builder.Middleware.dialogVersion({version: 0.1}));
        bot.use(builder.Middleware.sendTyping());

        // Initialise dialogs and routes
        dialogs.init(bot).then(function() {
            // Initialise our custom entity recognizer
            return entityRecognizer.init();
        }).then(function() {
            resolve(connector);
        }).catch(function(err) {
            reject(err);
        });
    });
}

module.exports.init = init;
