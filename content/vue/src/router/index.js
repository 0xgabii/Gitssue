import Vue from 'vue';
import VueRouter from 'vue-router';

import Repos from '../components/Pages/Repos';
import Issues from '../components/Pages/Issues';
import Issue from '../components/Pages/Issue';
import NewIssue from '../components/Pages/NewIssue';

Vue.use(VueRouter);

export default new VueRouter({
  routes: [
    {
      path: '/',
      name: 'Repos',
      component: Repos,
    },
    {
      path: ':owner/:name/issues',
      component: Issues,
      children: [
        {
          path: '',
          name: 'Issues',
          component: NewIssue,
        },
        {
          path: ':number',
          name: 'Issue',
          component: Issue,
        },
      ],
    },
  ],
});
