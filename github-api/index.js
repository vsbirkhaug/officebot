let Promise = require('bluebird');
let request = require('request');

const baseUri = 'https://api.github.com/';

let indexIssues = function indexIssues(repoName) {
    let url = baseUri + 'repos/' + repoName + '/issues';
    let token = process.env.GH_TOKEN;

    let req = {
        url: url,
        headers: {
            'User-Agent': 'OfficeBot',
            'Accept': 'application/vnd.github.v3+json',
            'Authorization': 'token ' + token,
        }
    };

    return new Promise(function(resolve, reject) {
        request.get(req, function(err, res, body) {
            if (err) {
                reject(err);
            }

            let rawIssues = JSON.parse(body);
            let formattedIssues = [];

            rawIssues.forEach(function(rawIssue) {
                formattedIssues.push({
                    id: rawIssue.number,
                    url: rawIssue.html_url,
                    title: rawIssue.title
                });
            });

            resolve(formattedIssues);
        });
    });
};

let showIssue = function showIssue(repoName, issueId) {
    console.log('github-api.showIssue');
    
    console.log(repoName, issueId);

    let url = baseUri + 'repos/' + repoName + '/issues/' + issueId;
    let token = process.env.GH_TOKEN;

    let req = {
        url: url,
        headers: {
            'User-Agent': 'OfficeBot',
            'Accept': 'application/vnd.github.v3+json',
            'Authorization': 'token ' + token,
        }
    };

    return new Promise(function (resolve, reject) {
        request.get(req, function(err, res, body) {
            if (err) {
                return reject(err);
            }

            if (res.statusCode === 404) {
                let notFound = new Error('Issue not found');
                notFound.statusCode = res.statusCode;
                return reject(notFound);
            }

            let rawIssue = JSON.parse(body);

            let issue = {
                title: rawIssue.title,
                url: rawIssue.html_url,
                id: rawIssue.number
            };

            resolve(issue);            
        });
    });
};

module.exports = {
    indexIssues: indexIssues,
    showIssue: showIssue
};