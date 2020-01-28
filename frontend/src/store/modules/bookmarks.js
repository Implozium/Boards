import API from '@/utils/API';

export default {
    namespaced: true,
    state: {
        bookmarks: [],
    },
    getters: {
        bookmarkById: state => id => {
            return state.bookmarks.find(aBookmark => aBookmark.id === id);
        },
        bookmarks: state => {
            return state.bookmarks;
        },
    },
    mutations: {
        update(state, { bookmark }) {
            const index = state.bookmarks.findIndex(aBookmark => aBookmark.id === bookmark.id);
            if (index !== -1) {
                state.bookmarks.splice(index, 1, bookmark);
            } else {
                state.bookmarks.push(bookmark);
            }
        },
        remove(state, { id }) {
            const index = state.bookmarks.findIndex(aBookmark => aBookmark.id === id);
            if (index !== -1) {
                state.bookmarks.splice(index, 1);
            }
        },
        set(state, { bookmarks }) {
            state.bookmarks = bookmarks;
        }
    },
    actions: {
        load({ commit }) {
            return API.bookmarks.loadAll()
                .then((bookmarks) => {
                    commit('set', { bookmarks });
                })
                .catch((err) => {
                    console.log(err);
                });
        },
        update({ commit }, { bookmark }) {
            return API.bookmarks.update(bookmark)
                .then((res) => {
                    commit('update', { bookmark });
                })
                .catch((err) => {
                    console.log(err);
                });
        },
        remove({ commit }, { id }) {
            return API.bookmarks.remove(id)
                .then((res) => {
                    commit('remove', { id });
                })
                .catch((err) => {
                    console.log(err);
                });
        },
    },
    modules: {
    },
};