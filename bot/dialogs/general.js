let general = {
    notSure: function(session) {
        let msg = 'Hmm... Nope. I\'m afraid I didn\'t quite get that!'
                + ' I\'m still quite new to all this human stuff.';
        session.endDialog(msg);
    },

    greeting: function(session, args, next) {
        let msg = 'Hey there!';
        session.endDialog(msg);
    },

    help: function(session) {
        let msg = 'Well, I\'m here to help with any office needs'
            + ' so just ask me to do something and I\'ll do my best!';
        session.endDialog(msg);
    },

    clearProfile: function(session) {
        session.send('Okay, I\'ll clear your profile now!');
        session.privateConversationData = {};
        session.send('Looks like we\'re done!');
        session.endConversation();
    },
};

module.exports = general;
