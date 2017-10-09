<template>
  <div 
    id="vGitssue" 
    :class="{ extend }"
    :style="computedStyle">

    <cotents-view v-if="extend" />

    <i
      v-else
      class="ion-social-github"
      @click="changeUI({ category: 'extend', value: true })"
    />

  </div>
</template>

<script>
import { mapGetters, mapState, mapActions } from 'vuex';

import firebase from './helpers/firebase';

import CotentsView from './components/CotentsView';

const database = firebase.database();

export default {
  name: 'app',
  computed: {
    ...mapState('ui', [
      'extend',
    ]),
    ...mapGetters('ui', [
      'computedStyle',
    ]),
  },
  methods: {
    ...mapActions('auth', [
      'signIn',
    ]),
    ...mapActions('ui', [
      'changeUI',
    ]),
  },
  created() {
    firebase.auth().onAuthStateChanged((user) => {
      if (user) {
        database.ref(`users/${user.uid}`).once('value').then((snapshot) => {
          this.signIn(snapshot.val());
        });
      }
    });
  },
  components: {
    CotentsView,
  },
};
</script>

<style lang="scss" src="./styles/main.scss" />
