let Promise = require('bluebird');
let redis = require('redis');
Promise.promisifyAll(redis.RedisClient.prototype);
Promise.promisifyAll(redis.Multi.prototype);

let client = redis.createClient();

let store = function store(key, value) {
    throw new Error('Not Implemented');
}

let get = function get(key) {
    throw new Error('Not Implemented');
}

module.exports = {
    store: store,
    get: get
};
