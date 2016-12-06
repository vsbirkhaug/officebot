module.exports = {
    init: function(bot, intent) {
        require('./dialogs')(bot);
        require('./router')(bot, intent);
    }
};
