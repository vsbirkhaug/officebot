let Promise = require('bluebird');
let general = require('./general');
let github = require('./github');
let trello = require('./trello');
let teams = require('./teams');
let config = require('../config');

let init = function init(bot) {
    return new Promise(function(resolve, reject) {
        // General
        bot.dialog('/greeting', general.greeting).triggerAction({matches: 'general.greet'});
        // Should we still handle None?
        bot.dialog('/not_sure', general.notSure).triggerAction({matches: 'None'});
        bot.dialog('/how_to_use', general.help).triggerAction({matches: 'general.help'});
        bot.dialog('/thanks', general.thanks).triggerAction({matches: 'general.thanks'});
        bot.dialog('/clear_profile', general.clearProfile).triggerAction({matches: 'profile.clear'});

        // Team
        bot.dialog('/teams_index', teams.index).triggerAction({matches: 'teams.index'});
        bot.dialog('/team_create', teams.create).triggerAction({matches: 'teams.create'});

        config.get().then(function(settings) {
            // GitHub
            if (settings.github.isOn === 'true') {
                bot.dialog('/github_repo_issues_index', github.indexIssues).triggerAction({matches: 'github.repo.issues.index'});
                bot.dialog('/github_repo_issues_show', github.getIssue).triggerAction({matches: 'github.repo.issues.show'});
                bot.dialog('/github_repo_issues_create', github.createIssue).triggerAction({matches: 'github.repo.issues.create'});
            }
            // Trello
            if (settings.trello.isOn === 'true') {
                bot.dialog('/trello_next_task_view', trello.getNextCard).triggerAction({matches: 'trello.board.next'});
                bot.dialog('/trello_next_task_claim', trello.claimNextCard);
            }

            resolve(bot);
        });
    });
};

module.exports.init = init;
