import Vue from 'vue';
import VueRouter from 'vue-router';

import Home from '../components/Pages/Home';
import Repos from '../components/Pages/Repos';
import NewIssue from '../components/Pages/NewIssue';
import Notification from '../components/Pages/Notification';
import Settings from '../components/Pages/Settings';

Vue.use(VueRouter);

export default new VueRouter({
  routes: [
    {
      path: '/',
      name: 'Home',
      component: Home,
    },
    {
      path: '/repositories',
      name: 'Repositories',
      component: Repos,
    },
    {
      path: '/new-issue',
      name: 'NewIssue',
      component: NewIssue,
    },
    {
      path: '/notification',
      name: 'Notification',
      component: Notification,
    },
    {
      path: '/settings',
      name: 'Settings',
      component: Settings,
    },
  ],
});
