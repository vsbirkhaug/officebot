let Promise = require('bluebird');
let express = require('express');
let bot = require('./bot');
let webServer = require('./web-server');
let memory = require('./bot/memory');
let server = express();

// Mount the web app
server.use(webServer());
console.log('web server initialised');

function initialiseBot() {
    return new Promise(function(resolve, reject) {
        // Get the config settings from Redis
        memory.get('config').then(function(config) {

            // If the config doesn't exist in Redis, we'll have undefined here.
            // We still want to be able to run the web service though.
            if (!config) {
                console.log('Configs not yet set, please use the web interface and then restart this service!');
                resolve();
            } else {
                console.log('initialising the bot');

                return bot.init(config).then(function(botConnector) {
                    // Mount the bot on the server
                    server.post('/api/messages', botConnector.listen());
                    console.log('bot initialised');

                    resolve();
                }).catch(function(err) {
                    reject(err);
                });
            }
        }).catch(function(err) {
            reject(err);
        });
    });
}

initialiseBot().then(function(botConnector) {
    // Set the http server to listen
    return server.listen(80, function() {
        console.log('Listening on:', 80);
    });
}).catch(function(err) {
    console.log(err);
});