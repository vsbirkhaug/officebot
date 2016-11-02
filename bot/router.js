module.exports = function(bot, intent) {
    bot.dialog('/', intent);

    // Intent routers
    intent.matches('general.greet', '/greeting');
    intent.matches('profile.clear', '/clear_profile');
    intent.matches('None', '/not_sure');
    intent.onDefault('/not_sure');
};
