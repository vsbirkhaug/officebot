let request = require('request');
let MarkdownFormatter = require('./markdown_formatter.js');

module.exports = function(bot, builder) {
    bot.dialog('/not_sure', function(session) {
        let msg = 'Hmm... Nope. I\'m afraid I didn\'t quite get that!'
                + ' I\'m still quite new to all this human stuff.';
        session.send(msg);
        session.endDialog();
    });

    bot.dialog('/greeting', [function(session, args, next) {
        if (!session.privateConversationData.name) {
            session.send('Hi! I don\'t think we\'ve met before.');
            session.beginDialog('/profile');
        } else {
            let msg = 'Hi '
                + session.privateConversationData.name
                + ', it\'s great to see you again!';
            session.send(msg);
            session.endDialog();
        }
    }]);

    bot.dialog('/how_to_use', function(session) {
        let msg = 'Hey, well I\'m here to help with any office needs'
            + ' so just ask me to do something and I\'ll do my best!';

        session.send(msg);
    });

    bot.dialog('/profile', [
        function(session) {
            let msg = 'Can I ask you to login with github?';
            builder.Prompts.text(session, msg);
        },
        function(session, result) {
            let isYes = builder.EntityRecognizer.parseBoolean(result.response);
            if (isYes) {
                session.send('Sweet, follow the instructions here!');
                let address = session.message.address;
                let url = 'https://github.com/login/oauth/authorize'
                    + '?client_id=' + process.env.GH_CLIENT_ID
                    + '&scope=user%20repo'
                    + '&redirect_uri=' + process.env.GH_AUTH_REDIRECT
                    + '&state='
                    + encodeURIComponent(JSON.stringify(address));

                session.send(new builder.Message(session).addAttachment(
                    new builder.SigninCard(session)
                        .text('Authenticate with GitHub')
                        .button('Sign-in', url)
                ));
            } else {
                let msg = 'Huh, okay well I can\'t do much now I\'m afraid.';
                session.send(msg);
            }

            session.endDialog(); // I think this is correct?
        },
    ]);

    bot.dialog('/oauth-success', [
        function(session, token) {
            session.privateConversationData.ghToken = token;
            session.send('Awesome, you can close that now.');

            let msg = 'I\'m just grabbing some of your details from GitHub. '
                + 'Won\'t be a moment!';
            session.send(msg);

            request.get({
                url: 'https://api.github.com/user',
                headers: {'User-Agent': 'OfficeBot'},
                qs: {'access_token': session.privateConversationData.ghToken},
            },
            function(err, res, body) {
                if (err) {
                    console.log('Error with getting user content');
                    let msg = 'It seems I can\'t get your'
                        + 'information right now.';
                    session.send(msg);

                    msg = 'Try something else instead, '
                        + 'this may be a GitHub issue!';
                    session.send(msg);
                } else {
                    console.log('got the name maybe?');
                    let user = JSON.parse(body);
                    console.log(user);

                    // Trim name down to the first name
                    let name = user.name.split(' ')[0];
                    session.send('Okay %s, I\'ve got your details now!', name);
                    session.privateConversationData.name = name;
                }

                session.endDialog();
            });
        },
    ]);

    bot.dialog('/github_my_issues', function(session) {
        if (!session.privateConversationData.ghToken) {
            session.send('Oh hold on, we need to authenticate you first.');
            session.replaceDialog('/profile');
        }
        session.send('Sure thing, just a mo');

        let token = session.privateConversationData.ghToken;
        request.get({
            url: 'https://api.github.com/user/issues',
            headers: {
                'User-Agent': 'OfficeBot',
                'Accept': 'application/vnd.github.v3+json',
                'Authorization': 'token ' + token,
            },
        },
        function(err, res, body) {
            console.log('Got response');
            let issues = JSON.parse(body);

            // Title
            let msgText = '**Here are the issues assigned to you:**\n\n';

            // List
            for (let i = 0; i < issues.length; i++) {
                // Only show the first 9
                if (i == 9) {
                    msgText += 'There are a few more after that!';
                    break;
                }

                // Repo name link
                let repoUrl = issues[i].repository.html_url;
                let repoName = issues[i].repository.owner.login
                    + '/'
                    + issues[i].repository.name;
                msgText += MarkdownFormatter.link(repoName, repoUrl);
                msgText += ' - ';
                // Issue name link
                let issueUrl = issues[i].html_url;
                let issueTitle = issues[i].title;
                msgText += MarkdownFormatter.link(issueTitle, issueUrl);
                msgText += '\n\n';
            }

            let mdMessage = new builder.Message(session)
                .textFormat(builder.TextFormat.markdown)
                .text(msgText);

            session.send(mdMessage);
            session.endDialog();
        });
    });

    bot.dialog('/clear_profile', function(session) {
        session.send('Okay, I\'ll clear your profile now!');
        session.privateConversationData = {};
        session.send('Looks like we\'re done!');
        session.endConversation();
    });
};
