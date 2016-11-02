var request = require("request");

module.exports = function(server, bot) {
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
};