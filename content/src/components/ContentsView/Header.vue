<template>
  <div class="contentsView-header">
    
    <div class="navigate">
      <button
        :class="{ disabled: !isBackAvailable }"
        @click="back">
        <i class="ion-ios-arrow-back" />
      </button>
      <button 
        :class="{ disabled: !isForwardAbailable }"
        @click="forward">
        <i class="ion-ios-arrow-forward" />
      </button>

      <p class="navigate__location">{{$route.fullPath}}</p>
    </div>
    
    <div class="controls">
      <button @click="changeUI({ category: 'extend', value: false })">
        <i class="ion-android-close" />
      </button> 
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
  computed: {
    isBackAvailable() {
      const { history, current } = this.router;

      if (current === history.length - 1) return false;

      return true;
    },
    isForwardAbailable() {
      const { current } = this.router;

      if (current === 0) return false;

      return true;
    },
  },
  watch: {
    $route({ name, params, query }) {
      const route = {
        name,
        params,
        query,
      };
      // Do not save history when use back or forward button
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
      this.router.current += 1;
      this.router.useBtnForMove = true;
      this.$router.replace(this.router.history[this.router.current]);
    },
    forward() {
      this.router.current -= 1;
      this.router.useBtnForMove = true;
      this.$router.replace(this.router.history[this.router.current]);
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
