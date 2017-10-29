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
        :key="tab.name"
        :class="{ active: tab.name === page.component }"
        @click="handleMovePage({ component: tab.name })">
        <i :class="tab.name === page.component ? tab.activeIcon : tab.icon" />
        {{ tab.name }}
      </li>
    </ul>

  </div>
</template>

<script>
import { mapState, mapActions } from 'vuex';

import Repositories from './Pages/Repos';
import Issues from './Pages/Issues';
import Issue from './Pages/Issue';

export default {
  name: 'ContentsView',
  data: () => ({
    page: {
      component: 'repositories',
      props: {},
    },

    tabs: [
      {
        icon: 'ion-ios-box-outline',
        activeIcon: 'ion-ios-box',
        name: 'repositories',
      },
      {
        icon: 'ion-ios-compose-outline',
        activeIcon: 'ion-ios-compose',
        name: 'issues',
      },
      {
        icon: 'ion-ios-box-outline',
        activeIcon: 'ion-ios-box',
        name: 'timeline',
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
    Repositories,
    Issues,
    Issue,
  },
};
</script>
