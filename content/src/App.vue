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

import CotentsView from './components/CotentsView';

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
      'authentication',
    ]),
    ...mapActions('ui', [
      'changeUI',
    ]),
  },
  created() {
    this.authentication();
  },
  components: {
    CotentsView,
  },
};
</script>

<style lang="scss" src="./styles/main.scss" />
