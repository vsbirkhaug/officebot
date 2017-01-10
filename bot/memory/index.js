let Promise = require('bluebird');
let redis = require('redis');
let warp = require('warp10');
Promise.promisifyAll(redis.RedisClient.prototype);
Promise.promisifyAll(redis.Multi.prototype);

let client;

// Heroku deploys use an environment variable
if (process.env.REDIS_URL) {
    client = redis.createClient(process.env.REDIS_URL);
} else {
    client = redis.createClient();
}

let store = function store(key, obj) {
    let objValue = warp.stringify(obj);
    console.log(objValue);

    return new Promise(function(resolve, reject) {
        client.setAsync(key, objValue).then(function() {
            resolve();
        }).catch(function(err) {
            console.log('err storing');
            reject(err);
        })
    });
}

let get = function get(key) {
    return new Promise(function(resolve, reject) {
        client.getAsync(key).then(function(jsonStr) {
            if (jsonStr) {
                resolve(warp.parse(jsonStr));
            } else {
                resolve();
            }
        }).catch(function(err) {
            reject(err);
        });
    });
    
}

module.exports = {
    store: store,
    get: get
};
