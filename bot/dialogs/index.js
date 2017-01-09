let Promise = require('bluebird');
let general = require('./general');
let github = require('./github');
let trello = require('./trello');
let teams = require('./teams');
let config = require('../config');

function initDialog(bot, name, action, trigger) {
    if (trigger) {
        // User triggered dialog
        bot.dialog(name, action).triggerAction({
            matches: trigger
        }).cancelAction(name + '_cancel', "Okay, I've cancelled that", {
            matches: /^(cancel|nevermind)/i
        });
    } else {
        // No trigger or cancel, just a dialoge
        bot.dialog(name, action);
    }
}

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
        initDialog(bot, '/teams_index', teams.index, 'teams.index');
        initDialog(bot, '/teams_create', teams.create, 'teams.create');

        config.get().then(function(settings) {
            // GitHub
            if (settings.github.isOn === 'true') {
                initDialog(bot, '/github_repo_issues_index', github.indexIssues, 'github.repo.issues.index');
                initDialog(bot, '/github_repo_issues_show', github.getIssue, 'github.repo.issues.show');
                initDialog(bot, '/github_repo_issues_create', github.createIssue, 'github.repo.issues.create');
            }
            // Trello
            if (settings.trello.isOn === 'true') {
                initDialog(bot, '/trello_next_task_view', trello.getNextCard, 'trello.board.next');
                initDialog(bot, '/trello_next_task_claim', trello.claimNextCard);
            }

            resolve(bot);
        });
    });
};

module.exports.init = init;
