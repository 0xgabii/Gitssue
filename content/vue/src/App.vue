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
    extend(bools) {
      utils.message('sync', {
        type: 'save',
        value: { ui: { extend: bools } },
      });
    },
    $route(to) {
      utils.message('sync', {
        type: 'save',
        value: { route: to.fullPath },
      });
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

    // start synchronize settings
    utils.message('sync', { type: 'load' });
    // apply synchronized settings
    window.addEventListener('message', ({ data: { port, msg } }) => {
      if (port === 'sync') {
        const { route, ui } = msg;

        Object.keys(ui).forEach((key) => {
          this.changeUI({ category: key, value: ui[key] });
        });

        this.$router.replace({ path: route });
      }
    });
  },
  components: {
    CotentsView,
  },
};
</script>

<style lang="scss" src="./styles/main.scss" />
