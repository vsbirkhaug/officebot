let entityRecognizer = require('../entityRecognizer');

let general = {
    notSure: function(session, args) {
        console.log('general.notSure');
        
        let msg = 'Hmm... Nope. I\'m afraid I didn\'t quite get that!'
                + ' I\'m still quite new to all this human stuff.';
        session.endDialog(msg);
    },

    greeting: function(session) {
        console.log('general.greeting');

        let msg = "Hey there! I'm told I'm performing today, ";
                msg += " so if you've not seen anything quite like me"
                msg += " then just ask me what I can do!";

            session.endDialog(msg);

        /*entityRecognizer.recognize(session, 'github.repo.name').then(function(result) {
            
        }).catch(function(err) {
            console.log(err);
            session.endDialog('I broke');
        });*/
    },

    help: function(session) {
        console.log('general.help');
        let msg = '';

        session.send("I can do many things, I'm actually quite talented!");
        session.sendBatch();

        msg = "I manage a trello board at the moment.";
        msg += "You can ask me what's next on there if you like";
        session.send(msg);
        session.sendBatch();

        session.send("I'm pretty good at listing and creating github issues as well");
        session.sendBatch();

        msg = "And I'm learning how to create and manage teams.";
        msg += " But having never been in a team myself, I'm not quite ready to show you that yet";
        session.send(msg);
        session.sendBatch();

        msg = "Oh and I'm looking for suggestions as well, ";
        msg += "is there something your team do a lot?";
        msg += "perhaps I can learn to do it so you don't have to worry about it anymore.";
        session.send(msg);
        session.sendBatch();

        msg = "I use 'Natural Language Processing', hopefully you can just talk to me like ";
        msg += "any of your human 'friends'.";
        msg += " It's early days though. Even if I don't understand you right now, I collect";
        msg += " what you say and I'll use it to learn from later.";
        session.send(msg);

        session.send("Under supervision of course.");

        session.endDialog();
    },

    thanks: function(session) {
        session.endDialog("You're welcome!");
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
