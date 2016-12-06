let Promise = require('bluebird');
let request = require('request');

let githubApi = {
    indexIssues: function indexIssues(repoName) {
        return new Promise(function(resolve, reject) {
            let url = 'https://api.github.com/repos/' + repoName + '/issues';
            let token = process.env.GH_TOKEN;

            let req = {
                url: url,
                headers: {
                    'User-Agent': 'OfficeBot',
                    'Accept': 'application/vnd.github.v3+json',
                    'Authorization': 'token ' + token,
                }
            };

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
    }
}

module.exports = githubApi;