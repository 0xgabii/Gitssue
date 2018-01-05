import Vue from 'vue';
import VueRouter from 'vue-router';

import Profile from '../components/Pages/Profile';
import Issues from '../components/Pages/Issues';
import Issue from '../components/Pages/Issue';
import NewIssue from '../components/Pages/NewIssue';

Vue.use(VueRouter);

export default new VueRouter({
  routes: [
    {
      path: '/',
      name: 'Profile',
      component: Profile,
      meta: { keepAlive: true },
    },
    {
      path: '/:owner/:name/issues',
      component: Issues,
      children: [
        {
          path: '',
          name: 'Issues',
          component: Issue,
          props: {
            placeholder: true,
          },
        },
        {
          path: ':number',
          name: 'Issue',
          component: Issue,
        },
        {
          path: 'new',
          name: 'NewIssue',
          component: NewIssue,
        },
      ],
    },
  ],
});
