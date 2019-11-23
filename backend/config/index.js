const fs = require('fs');
const path = require('path');

class Config {
    constructor() {
        this.configs = {};
        fs.readdirSync(__dirname)
            .filter(filename => /\.json$/.test(filename))
            .sort((a, b) => /\.override\.json$/.test(a) ? 1 : /\.override\.json$/.test(b) ? -1 : a.localeCompare(b))
            .forEach((filename) => {
                const data = fs.readFileSync(path.resolve(__dirname, filename), 'utf8');
                const [, name, override] = /(.*)(\.override)?\.json$/.exec(filename);
                if (override) {
                    this.configs[name] = Object.assign(this.configs[name] || {}, JSON.parse(data));
                } else {
                    this.configs[name] = JSON.parse(data);
                }
            });
    }

    get(name) {
        return this.configs[name] || {};
    }
}

module.exports = new Config();