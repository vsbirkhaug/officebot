var builder = require('botbuilder'),
    restify = require('restify'),
    request = require('request');

// Create bot and chat connector
var connector = new builder.ChatConnector({
    appId: process.env.APP_ID,
    appPassword: process.env.APP_PASS
});
var bot = new builder.UniversalBot(connector);

// Create restify server
var server = restify.createServer();
server.use(restify.queryParser());
// Initialise web routes
require("./http_routes.js")(server, bot);
server.post("/api/messages", connector.listen());

/*
 * Set up bot and dialogs
 * */
// Create a new universal bot connected to the BotConnector

// Add LUIS as an intent model
var model = process.env.LUIS_MODEL;
var recognizer = new builder.LuisRecognizer(model);
var intent = new builder.IntentDialog({ recognizers: [recognizer] });
bot.dialog('/', intent);

// Add intent handlers
intent.matches('general.greet', "/greeting");
intent.matches('profile.clear', "/clear_profile");
intent.matches('None', "/not_sure");
intent.onDefault("/not_sure");

bot.dialog("/not_sure", function(session) {
    var msg = "Hmm... Nope. I'm afraid I didn't quite get that!"
            + " I'm still quite new to all this human stuff."
    session.send(msg);
    session.endDialog();
});

bot.dialog("/greeting", [function(session, args, next) {
    if (!session.privateConversationData.name) {
        session.send("Hi! I don\'t think we\'ve met before.");
        session.beginDialog("/profile");
    } else {
        session.send("Hi %s, it's great to see you again!", session.privateConversationData.name);
        session.endDialog();
    }
}]);

bot.dialog("/profile",[
    function (session) {
        builder.Prompts.text(session, "Can I ask you to login with github?");
    },
    function (session, result) {
        if (builder.EntityRecognizer.parseBoolean(result.response) == true) {
            session.send("Sweet, follow the instructions here!");
            var url = "https://github.com/login/oauth/authorize"
                + "?client_id=" + process.env.GH_CLIENT_ID
                + "&scope=user:email"
                + "&redirect_uri=" + process.env.GH_AUTH_REDIRECT
                + "&state=" + encodeURIComponent(JSON.stringify(session.message.address));
            
            session.send(new builder.Message(session).addAttachment(
                new builder.SigninCard(session)
                    .text("Authenticate with GitHub")
                    .button("Sign-in", url)
            ));
        } else {
            session.send("Huh, okay well I can't do much now I'm afraid.");
        }

        session.endDialog(); // I think this is correct?
    }
]);

bot.dialog("/oauth-success",[
    function (session, token) {
        session.privateConversationData.ghToken = token;
        session.send("Awesome, you can close that now.");
        session.send("I'm just grabbing some of your details from GitHub. Won't be a moment!");
        request.get({
            url: "https://api.github.com/user",
            headers: { "User-Agent": "OfficeBot" },
            qs: { "access_token": session.privateConversationData.ghToken }
        },
        function (err, res, body) {
            if (err) {
                console.log("Error with getting user content");
                session.send("It seems I can't get your information right now.");
                session.send("Try something else instead, this may be a GitHub issue!");
            } else {
                console.log("got the name maybe?");
                var user = JSON.parse(body);
                console.log(user);
                
                // Trim name down to the first name
                var name = user.name.split(" ")[0];
                session.send("Okay %s, I've got your details now!", name);
                session.privateConversationData.name = name;
            }

            session.endDialog();
        });
    }
]);

bot.dialog("/clear_profile", function(session) {
    session.send("Okay, I'll clear your profile now!");
    session.privateConversationData = {};
    session.send("Looks like we're done!");
    session.endConversation();
});

// Initialise bot dialogs
//require("./dialogs.js")(bot, builder);

// Initialise intent routes to dialogs
//require("./intents_router.js")(bot, intents);

// Set the http server to listen
server.listen(80, function() {
   console.log("Listening on:", 80);
});