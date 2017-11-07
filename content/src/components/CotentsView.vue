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
      
      <router-view v-if="auth" />

      <div v-else>
        you have to login github for viewing repos & issue
        <button @click="signIn">Sign In</button>
      </div>

    </div>

    <ul class="contentsView-footer">
      <router-link
        v-for="tab in tabs"
        tag="li"
        :to="{ name: tab.route }">
        <i :class="tab.route === $route.name ? tab.icon : `${tab.icon}-outline`" />
        {{ tab.name }}
      </router-link>
    </ul>

  </div>
</template>

<script>
import { mapState, mapActions } from 'vuex';

export default {
  name: 'ContentsView',
  data: () => ({
    tabs: [
      {
        icon: 'ion-ios-home',
        name: 'home',
        route: 'Home',
      },
      {
        icon: 'ion-ios-box',
        name: 'repositories',
        route: 'Repositories',
      },
      {
        icon: 'ion-ios-compose',
        name: 'new issue',
        route: 'NewIssue',
      },
      {
        icon: 'ion-ios-paperplane',
        name: 'notification',
        route: 'Notification',
      },
      {
        icon: 'ion-ios-gear',
        name: 'settings',
        route: 'Settings',
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
  },
};
</script>
