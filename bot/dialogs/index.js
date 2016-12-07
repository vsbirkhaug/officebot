let general = require('./general');
let github = require('./github');

module.exports = function(bot) {
    // General
    bot.dialog('/not_sure', general.notSure);
    bot.dialog('/greeting', general.greeting);
    bot.dialog('/how_to_use', general.help);
    bot.dialog('/clear_profile', general.clearProfile);

    // bot.dialog('/profile', github.profile);
    // bot.dialog('/oauth-success', github.oAuth);

    // GitHub
    bot.dialog('/github_repo_issues_index', github.indexIssues);
    bot.dialog('/github_repo_issues_show', github.getIssue);
};
