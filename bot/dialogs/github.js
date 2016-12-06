let MarkdownFormatter = require('../markdown_formatter');
let builder = require('botbuilder');
let utils = require('../utilities');
let githubApi = require('../../github-api');


let github = {

    indexIssues: function(session, args) {
        console.log('github.indexIssues');

        // Alert the user that something is happening
        session.send('I\'ll just take a look for you');
        session.sendBatch(); // Send right now

        // Get and format the repo name
        let repo = utils.extractEntity('repo', args);
        repo = repo.replace(' / ', '/');

        // Get the issues async
        githubApi.indexIssues(repo).then(function(issues) {

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
            session.send('Oh sorry I seem to be a bit broken, can you try again later?');
        }).finally(function() {
            session.endDialog();
        });
    },

    getIssue: function(session) {
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
    }
};

module.exports = github;
