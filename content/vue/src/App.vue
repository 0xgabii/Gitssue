<template>
  <div id="app" :class="{ extend }">

    <cotents-view v-show="extend" />

    <i
      v-show="!extend"
      class="ion-social-github"
      @click="changeUI({ category: 'extend', value: true })"
    />

  </div>
</template>

<script>
import { mapGetters, mapState, mapActions } from 'vuex';

import utils from './helpers/utils';

import CotentsView from './components/ContentsView';

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
  watch: {
    computedStyle(style) {
      this.handleIframeStyle(style);
    },
  },
  methods: {
    ...mapActions('auth', [
      'authentication',
    ]),
    ...mapActions('ui', [
      'changeUI',
    ]),
    handleIframeStyle(style = this.computedStyle) {
      utils.message('ui', { type: 'changeStyle', value: style });
    },
  },
  created() {
    this.authentication();
    this.handleIframeStyle();
  },
  components: {
    CotentsView,
  },
};
</script>

<style lang="scss" src="./styles/main.scss" />
