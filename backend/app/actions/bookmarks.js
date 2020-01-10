const BookmarksList = require('app/entities/BookmarksList');
const common = require('common');

module.exports = {
    loadAll({ username }) {
        return BookmarksList.load({ username })
            .then((aBookmarksList) => {
                return aBookmarksList.bookmarks;
            });
    },
    load({ username, id }) {
        return BookmarksList.load({ username })
            .then((aBookmarksList) => {
                return aBookmarksList.bookmarks.filter(aBookmark => aBookmark.id === id)[0];
            });
    },
    update({ username, id, bookmark }) {
        return BookmarksList.load({ username })
            .then((aBookmarksList) => {
                aBookmarksList.update(bookmark);
                return aBookmarksList.save();
            });
    },
    delete({ username, id }) {
        return BookmarksList.load({ username })
            .then((aBookmarksList) => {
                aBookmarksList.remove(id);
                return aBookmarksList.save();
            });
    },
};