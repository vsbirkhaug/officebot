let builder = require('botbuilder');

module.exports = {
    init: function(bot, intent) {
        bot.use(builder.Middleware.dialogVersion({version: 0.1, resetCommand: /^halt/i }));
        bot.use(builder.Middleware.sendTyping());

        require('./dialogs')(bot);
        require('./router')(bot, intent);
    }
};
