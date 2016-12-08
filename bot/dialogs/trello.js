let trelloApi = require('../../trello-api');
let builder = require('botbuilder');

let getNextCard = function(session, args, next) {
    console.log('trello.getNextCard');

    session.send('I\'ll just check trello');
    session.sendBatch(); // Async task so lets tell them we're checking

    return trelloApi.getNextItem().then(function(card) {
        if (!card) {
            session.send('It doesn\'t look like there\'s anything up next');
            session.send('Does this mean we can go home?');
            return session.endDialog();
        } else {
            let msg = 'Up next we have: ';
            msg += '_' + card.name + '_ - ' + card.url;
            session.send(msg);
            
            session.beginDialog('/trello_next_task_claim', card);
        }
    }).catch(function(err) {
        console.log('err');
        console.log(err);
        return session.endDialog(
            'Sorry I\'m having a few problems. You might have to check yourself :disappointed:'
        );
    });
};

// Internal: Used to ask if the bot should move the next card it just found over
let claimNextCard = [
    function(session, args, next) {
        console.log('trello.claimNextCard');

        // Store the card in the dialog data
        session.dialogData.card = args;

        // Buttons don't work on slack because Microsoft suck
        // at building anything these days.
        builder.Prompts.confirm(
            session,
            'Do you want to claim this task?',
            { listStyle: 'none'}
        );
    },
    function(session, results) {
        let card = session.dialogData.card;

        if (!results.response) {
            session.send('okay :smile_cat:');
        } else {
            trelloApi.claimNextCard(card).then(function() {
                console.log('done');
                session.send('Okay that\'s moved to In Progress');
            }).catch(function(err) {
                let msg = '';

                if (err.statusCode === 404) {
                    msg = 'The card or list seem to have vanished,';
                    msg += ' you might want to check it yourself';
                } else {
                    msg = 'Something went wrong and I\'m pretty confused!';
                }
                
                session.send(msg);
            }).finally(function() {
                session.endDialog();
            });
        }
    }
];

module.exports = {
    getNextCard: getNextCard,
    claimNextCard: claimNextCard
};
