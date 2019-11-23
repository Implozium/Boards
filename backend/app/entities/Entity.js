const cache = require('app/helpers/cache');

module.exports = class Entity {
    constructor(params) {}
    
    toJSON() {return {};}

    static clearCache(params) {
        return cache.delete(this.getCacheKey(params));
    }
    static getCacheKey(params) {
        return '';
    };

    static loadFromCache(params) {
        return cache.get(this.getCacheKey(params));
    }
    static loadFromStorage(params) {return Promise.resolve(null);}

    static load(params) {
        return this.loadFromCache(params)
            .then((result) => {
                if (result) {
                    return new this(result);
                }
                return this.loadFromStorage(params)
                    .then(result => new this(result))
                    .then(anEntry => anEntry.saveInCache().then(result => anEntry));
            })
    }

    saveInCache() {
        return cache.set(this.constructor.getCacheKey(this), this);
    }
    saveInStorage() {return Promise.resolve();}

    save() {
        return this.saveInStorage()
            .then(result => this.saveInCache());
    }

    deleteInCache() {
        return cache.delete(this.constructor.getCacheKey(this));
    }
    deleteInStorage() {return Promise.resolve();}

    delete() {
        return this.deleteInStorage()
            .then(result => this.deleteInCache());
    }
}