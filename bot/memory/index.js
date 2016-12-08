let Promise = require('bluebird');
let redis = require('redis');
Promise.promisifyAll(redis.RedisClient.prototype);
Promise.promisifyAll(redis.Multi.prototype);

let client = redis.createClient();

let store = function store(key, obj) {
    let objValue = JSON.stringify(obj);

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
                resolve(JSON.parse(jsonStr));
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
