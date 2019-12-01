import API from '@/utils/API.js';

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
            return API.loadTasks(boardId)
                .then((tasks) => {
                    commit('set', { tasks });
                })
                .catch((err) => {
                    console.log(err);
                });
        },
        update({ commit }, { task }) {
            return API.updateTask(task)
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
            return API.updateTask(task)
                .then((res) => {
                    //commit('update', task);
                })
                .catch((err) => {
                    console.log(err);
                });
        },
        remove({ commit }, { id }) {
            return API.removeTask(id)
                .then((res) => {
                    commit('remove', { id });
                })
                .catch((err) => {
                    console.log(err);
                });
        },
        expand({ commit }, { id }) {
            return API.expandTask(id)
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
            return API.copyTask(id)
                .then((res) => {
                    const task = getters['taskById'](id);
                    return dispatch('load', { boardId: task.boardId });
                })
                .catch((err) => {
                    console.log(err);
                });
        },
        extract({ commit, getters, dispatch }, { id, itemsIds }) {
            return API.extractTask(id, itemsIds)
                .then((res) => {
                    const task = getters['taskById'](id);
                    return dispatch('load', { boardId: task.boardId });
                })
                .catch((err) => {
                    console.log(err);
                });
        },
        separate({ commit, getters, dispatch }, { id, itemsIds }) {
            return API.separateTask(id, itemsIds)
                .then((res) => {
                    const task = getters['taskById'](id);
                    return dispatch('load', { boardId: task.boardId });
                })
                .catch((err) => {
                    console.log(err);
                });
        },
        attach({ commit, getters, dispatch }, { id, toTaskId }) {
            return API.attachTask(id, toTaskId)
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