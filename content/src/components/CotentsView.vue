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

<!--       <template v-if="auth">
        successfully sign in
        <button @click="signOut">Sign out</button>
      </template>

      <div v-else>
        you have to login github for viewing repos & issue
        <button @click="signIn">Sign In</button>
      </div>
       -->
      <component :is="page" />

    </div>

    <ul class="contentsView-footer">
      <li 
        v-for="tab in tabs"
        :key="tab.name"
        :class="{ active: page === tab.name }"
        @click="switchPage(tab.name)">
        <i :class="page === tab.name ? tab.activeIcon : tab.icon" />
        {{ tab.name }}
      </li>
    </ul>

  </div>
</template>

<script>
import { mapState, mapActions } from 'vuex';

import Repositories from './Pages/Repos';

export default {
  name: 'ContentsView',
  data: () => ({
    page: 'repositories',

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
    switchPage(anotherPage) {
      this.page = anotherPage;
    },
  },
  components: {
    Repositories,
  },
};
</script>
