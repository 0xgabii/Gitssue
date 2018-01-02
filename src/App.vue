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
    ...mapState('resource', [
      'sync',
    ]),
  },
  watch: {
    computedStyle: {
      handler(style) {
        utils.message('ui', {
          type: 'changeStyle',
          value: style,
        });
      },
      immediate: true,
    },
    extend(bools) {
      utils.message('sync', {
        type: 'save',
        value: { ui: { extend: bools } },
      });
    },
    $route({ name, params }) {
      utils.message('sync', {
        type: 'save',
        value: { route: { name, params } },
      });
    },
    sync({ ui, route }) {
      this.$router.replace(route);

      Object.keys(ui).forEach((key) => {
        this.changeUI({ category: key, value: ui[key] });
      });
    },
  },
  methods: {
    ...mapActions('ui', [
      'changeUI',
    ]),
    ...mapActions('resource', [
      'init',
    ]),
  },
  created() {
    this.init();
  },
  components: {
    CotentsView,
  },
};
</script>

<style lang="scss" src="./styles/main.scss" />
