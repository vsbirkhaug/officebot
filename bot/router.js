module.exports = function(bot, intent) {
    bot.dialog('/', intent);

    // Intent routers
    intent.matches('general.greet', '/greeting');
    intent.matches('general.help', '/how_to_use');

    intent.matches('profile.clear', '/clear_profile');

    intent.matches('github.repo.issues.index', '/github_repo_issues_index');
    intent.matches('github.repo.issues.show', '/github_repo_issues_show');
    intent.matches('github.repo.issues.create', '/github_repo_issues_create');

    intent.matches('trello.board.next', '/trello_next_task_view');

    // Don't handle the 'None' intent, it's not adviced. Instead
    // drop through to default.
    //intent.matches('None', '/not_sure');
    intent.onDefault('/not_sure');
};
