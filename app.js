var builder = require('botbuilder'),
    restify = require('restify'),
    request = require('request');

// Create restify server
var server = restify.createServer();
server.use(restify.queryParser());

// Initialise bot connector
// Process all /api/messages via the connector

/*
 * Set up web api routes for authentication etc.
 * */

server.get("/api/githuboauthcallback", function(req, res, next) {
    res.send(200); // Respond no matter what and assume it's all fine

    var authCode = req.query.code,
        address = JSON.parse(req.query.state);

    // Make the request to get the access_token
    request.post(
        {
            url: "https://github.com/login/oauth/access_token",
            headers: {
                "Accept": "application/json"
            },
            form: {
                "client_id": process.env.GH_CLIENT_ID,
                "client_secret": process.env.GH_CLIENT_SECRET,
                "code": authCode
            }
        },
        function(err, httpRes, body) {
            var res = JSON.parse(body),
                token = res.access_token;
            
            bot.beginDialog(address, "/oauth-success", token);
        }
    );
});

/*
 * Set up bot and dialogs
 * */
// Create a new universal bot connected to the BotConnector
var connector = new builder.ChatConnector({
    appId: process.env.APP_ID,
    appPassword: process.env.APP_PASS
});
var bot = new builder.UniversalBot(connector);
// Add LUIS as an intent model
var model = process.env.LUIS_MODEL;
var recognizer = new builder.LuisRecognizer(model);
var intents = new builder.IntentDialog({ recognizers: recognizer });

// Initialise bot dialogs
require("./dialogs.js")(bot, builder);

// Initialise intent routes to dialogs
require("./intents_router.js")(bot, intents);


/*bot.dialog("/not_sure", function(session) {
    var msg = "Hmm... Nope. I'm afraid I didn't quite get that!"
            + "I'm still quite new to all this human stuff."
    session.send(msg);
});

bot.dialog("/greeting", [function(session, args, next) {
    if (!session.privateConversationData.name) {
        session.send("Hi! I don\'t think we\'ve met before.");
        session.beginDialog("/profile");
    } else {
        session.send("Hi %s, it's great to see you again!", session.privateConversationData.name);
    }

    session.endDialog();
}]);

bot.dialog("/profile",
    [function (session) {
        builder.Prompts.text(session, "Can I ask you to login with github?");
    },
    function (session, result) {
        if (result.response.match(/yes/gi)) {
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
        session.endDialog();
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
                session.endDialog();
            } else {
                console.log("got the name maybe?");
                var user = JSON.parse(body);
                console.log(user);
                
                // Trim name down to the first name
                var name = user.name.split(" ")[0];
                session.send("Okay %s, I've got your details now!", name);
                session.privateConversationData.name = name;
                session.endDialog();
            }
        });
    }
]);*/

server.listen(80, function() {
   console.log("Listening on:", 80);
});
server.post("/api/messages", connector.listen());