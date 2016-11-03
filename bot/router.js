module.exports = function(bot, intent) {
    bot.dialog('/', intent);

    // Intent routers
    intent.matches('general.greet', '/greeting');
    intent.matches('general.help', '/how_to_use');

    intent.matches('profile.clear', '/clear_profile');

    intent.matches('github.my.issues', '/github_my_issues');

    intent.matches('None', '/not_sure');
    intent.onDefault('/not_sure');
};
