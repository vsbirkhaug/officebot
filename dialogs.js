let request = require('request');

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
                    + '&scope=user:email'
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

    bot.dialog('/clear_profile', function(session) {
        session.send('Okay, I\'ll clear your profile now!');
        session.privateConversationData = {};
        session.send('Looks like we\'re done!');
        session.endConversation();
    });
};
