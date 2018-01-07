<template>
  <transition name="vMessage">
    <div 
      v-if="vShow"
      class="vMessage"
      @mouseout="setTimeout"
      @mouseover="clearTimeout">

      <p class="vMessage__content">
        {{ content }}
      </p>

      <div 
        v-if="actions.length"
        class="vMessage-actions">
        <button 
          v-for="action in actions"
          :class="`
            vMessage-actions__button
            ${action.type && `vMessage-actions__button--${action.type}`}
          `"
          :key="action.text"
          @click="() => {
            $options.methods[action.handler]();
            hide();
          }">
          {{action.text}}
        </button>
      </div>

    </div>
  </transition>
</template>

<script>
export default {
  name: 'Message',
  data: () => ({
    vShow: false,
    timeout: undefined,
  }),
  methods: {
    setTimeout() {
      this.timeout = setTimeout(() => {
        this.hide();
      }, this.delay);
    },
    clearTimeout() {
      clearTimeout(this.timeout);
    },

    show() {
      this.vShow = true;
    },
    hide() {
      this.vShow = false;
    },
  },
  created() {
    setTimeout(() => {
      this.show();
      this.setTimeout();
    }, 300);
  },
  beforeDestroy() {
    this.clearTimeout();
  },
};
</script>
