let Promise = require('bluebird');
let builder = require('botbuilder');
let dialogs = require('./dialogs');
let router = require('./router');
let express = require('express');
let server = express();

function init(config) {
    return new Promise(function(resolve, reject) {
        // Create connector and bot
        let connector = new builder.ChatConnector({
            appId: config.bot.id,
            appPassword: config.bot.pass,
        });
        let bot = new builder.UniversalBot(connector);

        // Add LUIS as an intent model
        let model = config.bot.luisModel;
        let recognizer = new builder.LuisRecognizer(model);
        let intent = new builder.IntentDialog({recognizers: [recognizer]});

        // Initialise dialogs and routes
        dialogs.init(bot).then(function() {
            router.init(bot, intent);

            resolve(connector);
        }).catch(function(err) {
            reject(err);
        });
    });
}

module.exports.init = init;
