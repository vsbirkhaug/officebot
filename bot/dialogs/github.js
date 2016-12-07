let MarkdownFormatter = require('../markdown_formatter');
let builder = require('botbuilder');
let githubApi = require('../../github-api');

let indexIssues = [
    function(session, args, next) {
        console.log('github.indexIssues');

        // Get and format the repo name
        let repo = builder.EntityRecognizer.findEntity(args.entities, 'github.repo.name');
        let req = session.dialogData.req = {
            repo: repo ? repo.entity : null
        };

        if (!req.repo) {
            builder.Prompts.text(session, 'What repo shall I use?');
        } else {
            next();
        }
    },
    function(session, result, next) {
        let req = session.dialogData.req;
        if (result.response) {
            req.repo = result.response;
        }

        // BUG: For some reason this doesn't work, seems to be a problem
        // with the microsoft documentation. Issue submitted to builder repo
        // https://github.com/Microsoft/BotBuilder/issues/1803
        if (!req.repo) {
            // User said cancel
            session.send('Okay');
            return session.endDialog();
        }
        
        console.log('repo: ', req.repo);
        // LUIS adds spaces around the slash
        req.repo = req.repo.replace(' / ', '/');

        // Get the issues
        githubApi.indexIssues(req.repo).then(function(issues) {

            // Format the message
            let msg = '';

            if (issues.length > 5) {
                msg += 'There are quite a few so here are the top 5 \n\n';
                issues = issues.slice(0, 4);
            }

            issues.forEach(function(i) {
                msg += '[#' + i.id + '] ';
                msg += i.title + '\n\n';
                msg += i.url;
                msg += ' \n\n';
            });

            // Send the message
            session.send(msg);
        }).catch(function(err) {
            console.error(err);
            session.send('Oh no, something went wrong! Try again in a bit.');
        }).finally(function() {
            session.endDialog();
        });
    }
];

let getIssue = [
    function(session, args, next) {
        let repo = builder.EntityRecognizer.findEntity(args.entities, 'github.repo.name');
        let issueId = builder.EntityRecognizer.findEntity(args.entities, 'github.issue.id');

        let req = session.dialogData.req = {
            repo: repo ? repo.entity : null,
            issueId: issueId ? issueId.entity : null
        };

        // Prompt for repo
        if (!req.repo) {
            builder.Prompts.text(session, 'What repo shall I look in?');
        } else {
            next();
        }
    },
    function(session, results, next) {
        let req = session.dialogData.req;
        if (results.response) {
            req.repo = results.response;
        }

        // Assign it back (do we need to?)
        session.dialogData.req = req;

        // Prompt for issueId (if repo is null then the user cancelled)
        if (req.repo && !req.issueId) {
            builder.Prompts.number(session, 'What issue id are you looking for?');
        } else {
            next();
        }
    },
    function(session, results) {
        let req = session.dialogData.req;
        if (results.response) {
            req.issueId = results.response;
        }
        
        // If either is null then the user cancelled
        if (req.repo && req.issueId) {
            req.repo = req.repo.replace(' / ', '/');

            session.send('I\'ll see what I can find, hold on');
            session.sendBatch();

            githubApi.showIssue(req.repo, req.issueId).then(function(issue) {
                let msg = '[#' + issue.id + '] ' + issue.title;
                msg += '\n\n';
                msg += issue.url;

                session.send(msg);
            }).catch(function(err) {
                if (err.statusCode && err.statusCode === 404) {
                    session.send('I can\'t seem to find that issue');
                } else {
                    session.send('Well this is embarrassing, looks I broke a bit');
                }
            }).finally(function() {
                session.endDialog();
            });
        } else {
            session.endDialog('Okay, no problem');
        }
    }
];

module.exports = {
    indexIssues: indexIssues,
    getIssue: getIssue
};
