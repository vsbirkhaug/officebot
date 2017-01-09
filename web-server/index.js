let express = require('express');
let hbs = require('express-hbs');
let path = require('path');
let bodyParser = require('body-parser');
let memory = require('../bot/memory');

module.exports = function() {
    let app = express();

    // Parse request bodies
    app.use(bodyParser.urlencoded({ extended: true }));
    app.use(bodyParser.json({
        inflate: true
    }));

    app.engine('hbs', hbs.express4({
        partialsDir: __dirname + '/views/partials'
    }));
    app.set('view engine', 'hbs');
    app.set('views', __dirname + '/views');

    app.use('/assets', express.static(path.join(__dirname, 'assets')));

    let router = express.Router();

    router.get('/configuration', function(req, res) {
        memory.get('config').then(function(config) {
            res.render('configuration', {
                config: config,
                siteUrl: 'http://' + req.headers.host + '/'
            });
        }).catch(function(err) {
            console.log('failed to get the config object');

            res.render('configuration');
        });
    });

    router.post('/configuration', function(req, res) {
        let config = req.body;
        console.log(config);

        memory.store('config', config).then(function() {
            console.log('updated');

            res.sendStatus(201).end();
        }).catch(function(err) {
            console.log('failed to update config');

            res.sendStatus(500).end();
        });
    });

    router.get('/', function(req, res) {
        res.render('index', {
            siteUrl: 'http://' + req.headers.host + '/'
        });
    });

    app.use(router);

    return app;
};