let MarkdownFormatter = require('../markdown_formatter');
let builder = require('botbuilder');
let githubApi = require('../externals/github-api');

let allowedRepos = [
    'bluehatbrit/officebot',
];

function restrictRepoAccess(session) {
    let msg = 'During the demo it\'s probably safer if I only let you use the ';
    msg += '**' + allowedRepos[0] + '**';
    msg += ' repo. I mean, I don\'t really know you... do I.'
    msg += '\n\n';
    msg += 'So go nuts, but only with ' + '**' + allowedRepos[0] + '**!';
    
    session.endDialog(msg);
}

function formatIssueForUser(issue) {
    return '[#' + issue.id + '] ' + issue.title
            + '\n\n'
            + issue.url;
}

function sendIssue(session, issue) {
    session.send(formatIssueForUser(issue));
}

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
        
        // LUIS adds spaces around the slash
        req.repo = req.repo.replace(' / ', '/');

        // Get the issues
        githubApi.indexIssues(req.repo).then(function(issues) {

            // Format the message
            let msg = '';

            // Just get the top 5, we don't want to spam
            if (issues.length > 5) {
                msg += 'There are quite a few so here are the top 5 \n\n';
                issues = issues.slice(0, 4);
            }

            issues.forEach(function(i) {
                msg += formatIssueForUser(i) + '\n\n';
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
        console.log('github.getIssue');
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
                // Send the issue back to the user
                sendIssue(session, issue);
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

let createIssue = [
    function(session, args, next) { // ask for repo
        console.log('github.createIssue');

        let repo = builder.EntityRecognizer.findEntity(args.entities, 'github.repo.name');
        let issueName = builder.EntityRecognizer.findEntity(args.entities, 'github.issue.name');

        let req = session.dialogData.req = {
            repo: repo ? repo.entity : null,
            issueName: issueName ? issueName.entity : null
        };

        // Prompt for repo
        if (!req.repo) {
            builder.Prompts.text(session, 'What repo is the issue for?');
        } else {
            next();
        }
    },
    function(session, results, next) { // ask for issue name
        let req = session.dialogData.req;
        if (results.response) {
            req.repo = results.response;
        }
        session.dialogData.req = req; // do we need this?

        // repo will be null if the user has cancelled
        // at least it should be but Microsoft...
        if (req.repo && !req.issueName) {
            builder.Prompts.text(session, 'What shall I call the issue?');
        } else {
            next();
        }
    },
    function(session, results) { // create it
        let req = session.dialogData.req;
        if (results.response) {
            req.issueName = results.response;
        }

        req.repo = req.repo.replace(' / ', '/');

        // Restrict demo access!
        if (req.repo !== allowedRepos) {
            return restrictRepoAccess(session);
        }

        // If either are null, the user has cancelled
        if (req.repo && req.issueName) {
            // Make the API call
            githubApi.createIssue(req.repo, req.issueName).then(function(issue) {
                // Send the created issue back to the user
                sendIssue(session, issue);
            }).catch(function(err) {
                if (err.statusCode && err.statusCode === 404) {
                    session.send('Are you sure that repo exists, perhaps it\'s private?');
                } else {
                    session.send('I done gone messed up, probably best to try later.');
                }
            }).finally(function() {
                // Make sure to close the dialog
                session.endDialog();
            })
        } else {
            session.endDialog('Oh okay, sure');
        }
    }
]

module.exports = {
    indexIssues: indexIssues,
    getIssue: getIssue,
    createIssue: createIssue
};
