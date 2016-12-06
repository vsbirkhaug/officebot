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
        console.log(result);
        if (result.resumed === 'cancelled'
            || result.resumed === 'back'
            || result.resumed === 'notCompleted') {
            // User said cancel
            session.send('Okay');
            return session.endDialog();
        }

        return session.endDialog();

        let req = session.dialogData.req;
        if (result.response) {
            req.repo = result.response;
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

let getIssue = function(session) {
    let token = process.env.GH_TOKEN;
    let repo = process.env.GH_REPO;
    let issueId = 4;
    // /repos/:owner/:repo/issues/:number
    let url = 'https://api.github.com/repos/' + repo + '/issues/' + issueId;
    
    request.get(
        {
            url: url,
            headers: {
                'User-Agent': 'OfficeBot',
                'Accept': 'application/vnd.github.v3+json',
                'Authorization': 'token ' + token,
            },
        },
        function(err, res, body) {
            let issue = JSON.parse(body);

            let msg = issue.title + '/n/n';
            msg += issue.url;

            session.endDialog(msg);
        }
    );
};

module.exports = {
    indexIssues: indexIssues,
    getIssue: getIssue
};
