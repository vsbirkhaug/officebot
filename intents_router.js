module.exports = function(bot, intents) {
    intents.matches("general.greeting", "/greeting");
    intents.match("profile.clear", "/clear_profile");
    intents.matches("None", "/not_sure");

    intents.onDefault("/not_sure");

    bot.dialog("/", intents);
}