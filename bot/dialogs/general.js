let general = {
    notSure: function(session) {
        console.log('general.notSure');
        let msg = 'Hmm... Nope. I\'m afraid I didn\'t quite get that!'
                + ' I\'m still quite new to all this human stuff.';
        session.endDialog(msg);
    },

    greeting: function(session, args, next) {
        console.log('general.greeting');
        let msg = 'Hey there!';
        session.endDialog(msg);
    },

    help: function(session) {
        console.log('general.help');
        let msg = 'Well, I\'m here to help with any office needs'
            + ' so just ask me to do something and I\'ll do my best!';
        session.endDialog(msg);
    },

    clearProfile: function(session) {
        console.log('general.clearProfile');
        session.send('Okay, I\'ll clear your profile now!');
        session.privateConversationData = {};
        session.send('Looks like we\'re done!');
        session.endConversation();
    },
};

module.exports = general;
