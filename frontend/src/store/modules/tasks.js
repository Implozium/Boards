import API from '@/utils/API';

export default {
    namespaced: true,
    state: {
        tasks: [],
    },
    getters: {
        tasksByBoardId: state => boardId => {
            return state.tasks.filter(aTask => aTask.boardId === boardId);
        },
        taskById: state => id => {
            return state.tasks.find(aTask => aTask.id === id);
        },
        tasks: state => {
            return state.tasks;
        },
    },
    mutations: {
        update(state, { task }) {
            const index = state.tasks.findIndex(aTask => aTask.id === task.id);
            if (index !== -1) {
                state.tasks.splice(index, 1, task);
            } else {
                state.tasks.push(task);
            }
        },
        subupdate(state, { id, options = {} }) {
            const index = state.tasks.findIndex(aTask => aTask.id === id);
            if (index !== -1) {
                Object.entries(options).forEach(([ key, value ]) => {
                    if (state.tasks[index][key] !== undefined && value !== undefined) {
                        state.tasks[index][key] = value;
                    }
                });
            }
        },
        remove(state, { id }) {
            const index = state.tasks.findIndex(aTask => aTask.id === id);
            if (index !== -1) {
                state.tasks.splice(index, 1);
            }
        },
        clear(state) {
            state.tasks = [];
        },
        set(state, { tasks }) {
            // console.log(tasks, state.tasks);
            state.tasks = tasks;
            // tasks.forEach((aTask) => {
            //     const index = state.tasks.findIndex(someTask => someTask.id === aTask.id);
            //     if (index !== -1) {
            //         state.tasks.splice(index, 1, aTask);
            //     } else {
            //         state.tasks.push(aTask);
            //     }
            // });
        }
    },
    actions: {
        load({ commit }, { boardId }) {
            return API.tasks.loadAllByBoardId(boardId)
                .then((tasks) => {
                    commit('set', { tasks });
                })
                .catch((err) => {
                    console.log(err);
                });
        },
        update({ commit }, { task }) {
            return API.tasks.update(task)
                .then((res) => {
                    commit('update', { task });
                })
                .catch((err) => {
                    console.log(err);
                });
        },
        subupdate({ commit, getters }, { id, options }) {
            commit('subupdate', { id, options });
            const task = getters['taskById'](id);
            return API.tasks.update(task)
                .then((res) => {
                    //commit('update', task);
                })
                .catch((err) => {
                    console.log(err);
                });
        },
        remove({ commit }, { id }) {
            return API.tasks.remove(id)
                .then((res) => {
                    commit('remove', { id });
                })
                .catch((err) => {
                    console.log(err);
                });
        },
        expand({ commit }, { id }) {
            return API.tasks.expand(id)
                .then((res) => {
                    commit('remove', { id });
                })
                .catch((err) => {
                    console.log(err);
                });
        },
        clear({ commit }, {}) {
            commit('clear', {});
        },
        copy({ commit, getters, dispatch }, { id }) {
            return API.tasks.copy(id)
                .then((res) => {
                    const task = getters['taskById'](id);
                    return dispatch('load', { boardId: task.boardId });
                })
                .catch((err) => {
                    console.log(err);
                });
        },
        extract({ commit, getters, dispatch }, { id, itemsIds }) {
            return API.tasks.extract(id, itemsIds)
                .then((res) => {
                    const task = getters['taskById'](id);
                    return dispatch('load', { boardId: task.boardId });
                })
                .catch((err) => {
                    console.log(err);
                });
        },
        separate({ commit, getters, dispatch }, { id, itemsIds, toTaskId }) {
            return API.tasks.separate(id, itemsIds, toTaskId)
                .then((res) => {
                    const task = getters['taskById'](id);
                    return dispatch('load', { boardId: task.boardId });
                })
                .catch((err) => {
                    console.log(err);
                });
        },
        attach({ commit, getters, dispatch }, { id, toTaskId }) {
            return API.tasks.attach(id, toTaskId)
                .then((res) => {
                    const task = getters['taskById'](id);
                    return dispatch('load', { boardId: task.boardId });
                })
                .catch((err) => {
                    console.log(err);
                });
        },
    },
    modules: {
    },
};