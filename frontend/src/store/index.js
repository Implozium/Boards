import Vue from 'vue';
import Vuex from 'vuex';

import boards from './modules/boards';
import tasks from './modules/tasks';

Vue.use(Vuex);

const debug = process.env.NODE_ENV !== 'production';

export default new Vuex.Store({
    state: {
        inited: true,
    },
    getters: {
    },
    mutations: {
    },
    actions: {
    },
    modules: {
        boards: boards,
        tasks: tasks,
    },
    strict: debug,
});