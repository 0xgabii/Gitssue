<template>
  <div class="contentsView">

    <div class="contentsView-header">
      <h3>Gitssue</h3>
      <div class="contentsView-controls">
        <i class="ion-ios-settings" />
        <i class="ion-android-close" @click="changeUI({ category: 'extend', value: false })" />
      </div>
    </div>
    
    <div class="contentsView-body">
      
      <component
        v-if="auth" 
        :is="page.component" 
        v-bind="page.props"
        @move-page="handleMovePage"
      />

      <div v-else>
        you have to login github for viewing repos & issue
        <button @click="signIn">Sign In</button>
      </div>

    </div>

    <ul class="contentsView-footer">
      <li 
        v-for="tab in tabs"
        :key="tab.component"
        :class="{ active: tab.component === page.component }"
        @click="handleMovePage({ component: tab.component })">
        <i :class="tab.component === page.component ? tab.icon : `${tab.icon}-outline`" />
        {{ tab.name }}
      </li>
    </ul>

  </div>
</template>

<script>
import { mapState, mapActions } from 'vuex';

import Home from './Pages/Home';
import Repositories from './Pages/Repos';
import Issues from './Pages/Issues';
import Issue from './Pages/Issue';
import NewIssue from './Pages/NewIssue';
import Notification from './Pages/Notification';
import Settings from './Pages/Settings';

export default {
  name: 'ContentsView',
  data: () => ({
    page: {
      component: 'repositories',
      props: {},
    },

    tabs: [
      {
        icon: 'ion-ios-home',
        name: 'home',
        component: 'home',
      },
      {
        icon: 'ion-ios-box',
        name: 'repositories',
        component: 'repositories',
      },
      {
        icon: 'ion-ios-compose',
        name: 'new issue',
        component: 'new-issue',
      },
      {
        icon: 'ion-ios-paperplane',
        name: 'notification',
        component: 'notification',
      },
      {
        icon: 'ion-ios-gear',
        name: 'settings',
        component: 'settings',
      },
    ],
  }),
  computed: {
    ...mapState('auth', [
      'auth',
    ]),
  },
  methods: {
    ...mapActions('ui', [
      'changeUI',
    ]),
    ...mapActions('auth', [
      'signIn',
      'signOut',
    ]),
    handleMovePage({ component, props = {} }) {
      this.page = {
        component,
        props,
      };
    },
  },
  components: {
    Home,
    Repositories,
    Issues,
    Issue,
    NewIssue,
    Notification,
    Settings,
  },
};
</script>
