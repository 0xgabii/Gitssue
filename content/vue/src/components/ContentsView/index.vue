<template>
  <div class="contentsView">

    <header-nav />

    <div class="contentsView-wrapper">

      <template v-if="auth">

        <side-bar />
  
        <content-body />

      </template>

      <div v-else>
        you have to login github for viewing repos & issue
        <button @click="signIn">Sign In</button>
      </div>
      
    </div>
    
  </div>
</template>

<script>
import { mapState, mapActions } from 'vuex';

import Header from './Header';
import SideBar from './SideBar';
import Body from './Body';

export default {
  name: 'ContentsView',
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
  components: {
    HeaderNav: Header,
    ContentBody: Body,
    SideBar,
  },
};
</script>
