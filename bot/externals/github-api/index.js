let Promise = require('bluebird');
let request = require('request');
let config = require('../../config');

const baseUri = 'https://api.github.com/';

let indexIssues = function indexIssues(repoName) {
    console.log('github-api.indexIssues');

    // Create a promise to return
    return new Promise(function(resolve, reject) {

        // Async get the config
        return config.get().then(function(settings) {

            // Build and make the request
            let req = {
                url: baseUri + 'repos/' + repoName + '/issues',
                headers: {
                    'User-Agent': 'OfficeBot',
                    'Accept': 'application/vnd.github.v3+json',
                    'Authorization': 'token ' + settings.ghToken,
                },
                json: true
            };

            request.get(req, function(err, res, body) {
                if (err) {
                    reject(err);
                }

                let rawIssues = body;
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
    });
};

let showIssue = function showIssue(repoName, issueId) {
    console.log('github-api.showIssue');

    return new Promise(function (resolve, reject) {
        return config.get().then(function(settings) {
            let req = {
                url: baseUri + 'repos/' + repoName + '/issues/' + issueId,
                headers: {
                    'User-Agent': 'OfficeBot',
                    'Accept': 'application/vnd.github.v3+json',
                    'Authorization': 'token ' + settings.ghToken,
                },
                json: true
            };

            request.get(req, function(err, res, body) {
                if (err) {
                    return reject(err);
                }

                if (res.statusCode === 404) {
                    let notFound = new Error('Issue not found');
                    notFound.statusCode = res.statusCode;
                    return reject(notFound);
                }

                let rawIssue = body;

                let issue = {
                    title: rawIssue.title,
                    url: rawIssue.html_url,
                    id: rawIssue.number
                };

                resolve(issue);            
            });
        });

        
    });
};

let createIssue = function createIssue(repoName, issueTitle) {
    console.log('github-api.createIssue');

    return new Promise(function(resolve, reject) {
        return config.get().then(function(settings) {
            let req = {
                url: baseUri + 'repos/' + repoName + '/issues',
                headers: {
                    'User-Agent': 'OfficeBot',
                    'Accept': 'application/vnd.github.v3+json',
                    'Authorization': 'token ' + process.env.GH_TOKEN,
                },
                json: true,
                body: {
                    title: issueTitle,
                }
            };
            
            request.post(req, function(err, res, body) {
            if (err) {
                return reject(err);
            }
            if (res.statusCode === 404) {
                let notFound = new Error('Repo not found');
                notFound.statusCode = res.statusCode;
                return reject(notFound);
            }

            let rawIssue = body;
            let issue = {
                id: rawIssue.number,
                title: rawIssue.title,
                url: rawIssue.html_url
            };

            resolve(issue);
            });
        });
    });
};

module.exports = {
    indexIssues: indexIssues,
    showIssue: showIssue,
    createIssue: createIssue
};