<template>
  <div class="contentsView">

    <header-nav />

    <div class="contentsView-body">

      <template v-if="auth">

        <side-bar />
  
        <wrapper />

      </template>

      <button 
        v-else
        class="signIn" 
        @click="signIn">
        <i class="ion-social-github" />
        Sign in with Github
      </button>
      
    </div>
    
  </div>
</template>

<script>
import { mapState, mapActions } from 'vuex';

import Header from './Header';
import SideBar from './SideBar';
import Wrapper from './Wrapper';

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
    Wrapper,
    SideBar,
  },
};
</script>
