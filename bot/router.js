module.exports = function(bot, intent) {
    bot.dialog('/', intent);

    // Intent routers
    intent.matches('general.greet', '/greeting');
    intent.matches('general.help', '/how_to_use');

    intent.matches('profile.clear', '/clear_profile');

    intent.matches('github.repo.issues.index', '/github_repo_issues_index');
    //intent.matches('github.repo.issues.show', '/github_repo_issues_show');

    intent.matches('None', '/not_sure');
    intent.onDefault('/not_sure');
};
