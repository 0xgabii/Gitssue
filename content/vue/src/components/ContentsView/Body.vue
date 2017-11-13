<template>
  <router-view v-if="auth" class="contentsView-body" />

  <div v-else>
    you have to login github for viewing repos & issue
    <button @click="signIn">Sign In</button>
  </div>
</template>

<script>
import { mapState, mapActions } from 'vuex';

export default {
  name: 'ContentsViewBody',
  computed: {
    ...mapState('auth', [
      'auth',
    ]),
  },
  methods: {
    ...mapActions('auth', [
      'signIn',
    ]),
  },
};
</script>
