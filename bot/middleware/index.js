let mentionDetection = function(options) {
    return {
        botbuilder: function(session, next) {
            // Simple mention checking
            let isMentioned = (session.message.text.indexOf('@' + options.botName) >= 0);

            if (isMentioned) {
                // We've been mentioned, proceed
                session.privateConversationData.botName = options.botName;
                next();
            } else {
                // Ignore it, we've not been mentioned
                session.endDialog();
            }
        }
    }
};

let hardReset = function(options) {
    return {
        botbuilder: function(session) {
            let trigger = options.phrase;
            // If the bot has a name, take it and use it for better detection
            if (session.privateConversationData.botName) {
                trigger = '@' + session.privateConversationData.botName + ' ' + options.phrase;
            }

            if (session.message.text === trigger) {
                session.endConversation("Resetting your conversation!");
            }
        }
    }
}

module.exports = {
    mentionDetection: mentionDetection,
    hardReset: hardReset
};