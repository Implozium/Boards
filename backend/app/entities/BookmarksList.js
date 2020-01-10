const Entity = require('app/entities/Entity');
const common = require('common');
const jsonfile = require('app/helpers/jsonfile');
const path = require('path');
const config = require('config');

module.exports = class BookmarksList extends Entity {
    constructor(params) {
        super();
        this.username = params.username;
        this.bookmarks = params.bookmarks.map(common.makeBookmark);
    }
    
    toJSON() {
        return {
            username: this.username,
            bookmarks: this.bookmarks
        };
    }

    update(params) {
        const aBookmark = common.makeBookmark(params);
        const index = this.bookmarks.findIndex(bookmark => bookmark.id === aBookmark.id);
        if (index !== -1) {
            this.bookmarks.splice(index, 1, aBookmark);
        } else {
            this.bookmarks.push(aBookmark);
        }
        return this;
    }

    remove(id) {
        const index = this.bookmarks.findIndex(aBookmark => aBookmark.id === id);
        if (index !== -1) {
            this.bookmarks.splice(index, 1);
        }
        return this;
    }

    static getFileName(username) {
        return path.resolve(config.get('global')['storage'], username, 'bookmarks.json');
    }

    static getCacheKey(params) {
        return ['bookmarks', params.username].join('::');
    };

    static loadFromStorage(params) {
        return jsonfile.load(BookmarksList.getFileName(params.username), [])
            .then((data) => {
                return {
                    username: params.username,
                    bookmarks: data,
                };
            });
    }

    /**
     * 
     * @param {{}} params 
     * @return {Promise.<BookmarksList>}
     */
    static load(params) {
        return super.load(params);
    }

    saveInStorage() {
        return jsonfile.save(BookmarksList.getFileName(this.username), this.bookmarks);
    }

    deleteInStorage() {
        this.bookmarks = [];
        return jsonfile.save(BookmarksList.getFileName(this.username), []);
    }
}