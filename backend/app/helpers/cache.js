class Cache {
    constructor() {
        this.cache = new Map();
    }
    set(key, data, params = {}) {
        console.log('cache set', key);
        this.cache.set(key, JSON.stringify({
            data,
            to: Number(params.expiresIn) > 0 ? Date.now() + Number(params.expiresIn) : Number.POSITIVE_INFINITY,
        }));
        return Promise.resolve();
    }
    get(key) {
        const row = this.cache.get(key);
        if (!row) {
            return Promise.resolve(null);
        }
        const { data, to } = JSON.parse(row);
        if (to < Date.now()) {
            this.cache.delete(key);
            return Promise.resolve(null);
        }
        if (data) {
            console.log('cache get', key);
        }
        return Promise.resolve(data);
    }
    delete(key) {
        this.cache.delete(key);
        return Promise.resolve();
    }
}

module.exports = new Cache();