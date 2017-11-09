<template>
  <ul class="contentsView-footer">
    <router-link
      v-for="tab in tabs"
      tag="li"
      replace
      :class="{ active: isLinkActived(tab.route) }"
      :key="tab.route"
      :to="{ name: tab.route }">
      <i :class="isLinkActived(tab.route) ? tab.icon : `${tab.icon}-outline`" />
      {{ tab.name }}
    </router-link>
  </ul>
</template>

<script>
export default {
  name: 'ContentsViewFooter',
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
        route: 'Repos',
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
  methods: {
    isLinkActived(route) {
      return this.$route.matched.length
        ? route === this.$route.matched[0].name
        : route === this.$route.name;
    },
  },
};
</script>
