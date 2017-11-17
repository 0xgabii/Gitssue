import Vue from 'vue';
import VueRouter from 'vue-router';

import Repos from '../components/Pages/Repos';
import Issues from '../components/Pages/Issues';
import Issue from '../components/Pages/Issue';

Vue.use(VueRouter);

export default new VueRouter({
  routes: [
    {
      path: '/',
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
  ],
});
