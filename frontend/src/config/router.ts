import Vue from 'vue';
import VueRouter, { RouteConfig } from 'vue-router';

import Home from '../views/Home.vue';
import AdminPages from '../views/AdminPages.vue';

Vue.use(VueRouter);

const routes: RouteConfig[] = [
  {
    name: 'home',
    path: '/',
    component: Home,
  },
  {
    name: 'adminPages',
    path: '/admin',
    component: AdminPages,
  },
];

export default new VueRouter({
  mode: 'history',
  routes,
});
