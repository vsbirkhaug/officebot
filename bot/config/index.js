let memory = require('../memory');

function get() {
    return memory.get('config');
}

module.exports.get = get;