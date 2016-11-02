module.exports = function(bot, intent) {
    intent.matches("general.greeting", "/greeting");
    intent.matches("profile.clear", "/clear_profile");
    intent.matches("None", "/not_sure");

    //intent.onDefault("/not_sure");
    //intent.onDefault("/clear_profile");
    intent.onDefault("/default");

    bot.dialog("/", intent);
}