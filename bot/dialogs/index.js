let Promise = require('bluebird');
let general = require('./general');
let github = require('./github');
let trello = require('./trello');
let teams = require('./teams');
let config = require('../config');

let init = function init(bot) {
    return new Promise(function(resolve, reject) {
        // General
        bot.dialog('/not_sure', general.notSure);
        bot.dialog('/greeting', general.greeting);
        bot.dialog('/how_to_use', general.help);
        bot.dialog('/thanks', general.thanks);
        bot.dialog('/clear_profile', general.clearProfile);

        // Team
        bot.dialog('/teams_index', teams.index);
        bot.dialog('/team_create', teams.create);

        config.get().then(function(config) {
            // GitHub
            bot.dialog('/github_repo_issues_index', github.indexIssues);
            bot.dialog('/github_repo_issues_show', github.getIssue);
            bot.dialog('/github_repo_issues_create', github.createIssue);

            // Trello
            bot.dialog('/trello_next_task_view', trello.getNextCard);
            bot.dialog('/trello_next_task_claim', trello.claimNextCard);

            resolve(bot);
        }).catch(function(err) {
            reject(err);
        });
    });
};

module.exports.init = init;
