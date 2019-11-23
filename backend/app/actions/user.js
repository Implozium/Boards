const fs = require('fs');
const path = require('path');

const config = require('config');

module.exports = {
    init(username = 'default') {
        const dir = path.resolve(config.get('global')['storage'], username);
        if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir);
        }
        return Promise.resolve(true);
    },
};