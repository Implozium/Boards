import API from '@/utils/API';

export default {
    namespaced: true,
    state: {
        boards: [],
    },
    getters: {
        boardById: state => id => {
            return state.boards.find(aBoard => aBoard.id === id);
        },
        boards: state => {
            return state.boards;
        },
    },
    mutations: {
        update(state, { board }) {
            const index = state.boards.findIndex(aBoard => aBoard.id === board.id);
            if (index !== -1) {
                state.boards.splice(index, 1, board);
            } else {
                state.boards.push(board);
            }
        },
        remove(state, { id }) {
            const index = state.boards.findIndex(aBoard => aBoard.id === id);
            if (index !== -1) {
                state.boards.splice(index, 1);
            }
        },
        set(state, { boards }) {
            state.boards = boards;
            // boards.forEach((aBoard) => {
            //     const index = state.boards.findIndex(someBoard => someBoard.id === aBoard.id);
            //     if (index !== -1) {
            //         state.boards.splice(index, 1, aBoard);
            //     } else {
            //         state.boards.push(aBoard);
            //     }
            // });
        }
    },
    actions: {
        load({ commit }) {
            return API.boards.loadAll()
                .then((boards) => {
                    commit('set', { boards });
                })
                .catch((err) => {
                    console.log(err);
                });
        },
        update({ commit }, { board }) {
            return API.boards.update(board)
                .then((res) => {
                    commit('update', { board });
                })
                .catch((err) => {
                    console.log(err);
                });
        },
        remove({ commit }, { id }) {
            return API.boards.remove(id)
                .then((res) => {
                    commit('remove', { id });
                })
                .catch((err) => {
                    console.log(err);
                });
        },
        constrict({ commit }, { id, boardId }) {
            return API.boards.constrict(id, boardId)
                .then((res) => {
                    commit('remove', { id });
                })
                .catch((err) => {
                    console.log(err);
                });
        },
        archiveDoneTasks({ commit, dispatch }, { id }) {
            return API.boards.archiveDoneTasks(id)
                .then((res) => {
                    return dispatch('tasks/load', { boardId: id }, { root: true });
                })
                .catch((err) => {
                    console.log(err);
                });
        },
    },
    modules: {
    },
};