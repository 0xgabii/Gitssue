<template>
  <div class="contentsView-header">
    <h3>
      <button @click="back">back</button>
      <button @click="forward">forward</button>  
      {{$route.fullPath}}
    </h3>
    <div class="contentsView-controls">
      <i class="ion-ios-settings" />
      <i class="ion-android-close" @click="changeUI({ category: 'extend', value: false })" />
    </div>
  </div>
</template>

<script>
import { mapActions } from 'vuex';

export default {
  name: 'ContentsViewHeader',
  data: () => ({
    router: {
      history: [],
      current: 0,
      useBtnForMove: false,
    },
  }),
  watch: {
    $route({ name, params, query }) {
      const route = {
        name,
        params,
        query,
      };

      if (this.router.useBtnForMove) {
        this.router = {
          ...this.router,
          useBtnForMove: false,
        };
      } else {
        this.router.history.unshift(route);
      }
    },
  },
  methods: {
    ...mapActions('ui', [
      'changeUI',
    ]),
    back() {
      const { history, current } = this.router;

      if (current === history.length - 1) return;

      this.router.current += 1;
      this.router.useBtnForMove = true;
      this.$router.replace(history[this.router.current]);
    },
    forward() {
      const { history, current } = this.router;

      if (current === 0) return;

      this.router.current -= 1;
      this.router.useBtnForMove = true;
      this.$router.replace(history[this.router.current]);
    },
  },
  created() {
    const { name, params, query } = this.$route;

    this.router.history.unshift({
      name,
      params,
      query,
    });
  },
};
</script>
