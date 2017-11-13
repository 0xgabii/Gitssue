import Vue from 'vue';
import VueRouter from 'vue-router';

import Home from '../components/Pages/Home';
import Repos from '../components/Pages/Repos';
import Issues from '../components/Pages/Issues';
import Issue from '../components/Pages/Issue';
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
      path: '/repos',
      name: 'Repos',
      component: Repos,
      children: [
        {
          path: ':owner/:name/issues',
          name: 'Issues',
          component: Issues,
        },
        {
          path: ':owner/:name/issues/:issueId',
          name: 'Issue',
          component: Issue,
        },
      ],
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
