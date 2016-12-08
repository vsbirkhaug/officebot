let express = require('express');
let hbs = require('express-hbs');

module.exports = function() {
    let app = express();

    app.engine('hbs', hbs.express4({}));
    app.set('view engine', 'hbs');
    app.set('views', __dirname + '/views');

    let router = express.Router();

    router.get('/', function(req, res, next) {
        res.render('index');
    });

    app.use(router);

    console.log('web-server initialised');

    return app;
};