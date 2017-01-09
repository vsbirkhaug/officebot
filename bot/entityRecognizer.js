let Promise = require('bluebird');
let builder = require('botbuilder');
let config = require('./config');
let recognizer;

function init() {
    return new Promise(function(resolve, reject) {
        return config.get().then(function(settings) {
            recognizer = new builder.LuisRecognizer(settings.bot.luisModel);
            resolve();
        }).catch(function(err) {
            reject(err);
        });
    });
}

function recognize(session, entity) {
    // Todo: split out this initialisation code into an init function and make it persist
    return new Promise(function(resolve, reject) {
        let context = {
            locale: session._locale,
            message: session.message
        };

        recognizer.recognize(context, function(err, result) {
            if (err) {
                return reject(err);
            }

            let entityValue = builder.EntityRecognizer.findEntity(result.entities, entity);
            resolve(entityValue);
        });
    });
}

module.exports = {
    init: init,
    recognize: recognize
};