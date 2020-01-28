import Vue from 'vue';
import VueRouter from 'vue-router';
import Board from './views/Board';
import Boards from './views/Boards';
import Bookmarks from './views/Bookmarks';

Vue.use(VueRouter);

export default new VueRouter({
    mode: 'history',
    base: process.env.BASE_URL,
    routes: [
        {
            path: '/boards',
            name: 'boards',
            component: Boards,
        },
        {
            path: '/boards/:id?',
            name: 'board',
            component: Board,
        },
        {
            path: '/bookmarks',
            name: 'bookmarks',
            component: Bookmarks,
        },
        // {
        //     path: '/about',
        //     name: 'about',
        //     // route level code-splitting
        //     // this generates a separate chunk (about.[hash].js) for this route
        //     // which is lazy-loaded when the route is visited.
        //     component: () => import(/* webpackChunkName: "about" */ './views/About'),
        // },
    ],
});
