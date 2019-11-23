const fs = require('fs');

module.exports = {
    load(filename) {
        return new Promise((res, rej) => {
            if (fs.existsSync(filename)) {
                return fs.readFile(filename, 'utf-8', (err, file) => err ? rej(err) : res(JSON.parse(file)));
            }
            return res({});
        });
    },

    save(filename, data) {
        return new Promise((res, rej) => {
            return fs.writeFile(filename, JSON.stringify(data, null, 4), 'utf-8', err => err ? rej(err) : res(true));
        });
    }
};