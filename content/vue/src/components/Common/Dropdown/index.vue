<template>
  <div class="dropdown">
    <button 
      class="dropdown__control"
      @mousedown="show">
      {{name}} <i :class="`ion-arrow-${visible ? 'up' : 'down'}-b`" />
    </button>
    <div 
      v-show="visible"
      tabindex="-1"
      ref="dropdownMenu"
      class="dropdown-menu"
      @blur="hide">
      <slot />
    </div>
  </div>
</template>

<script>
export default {
  name: 'Dropdown',
  props: {
    name: String,
  },
  data: () => ({
    visible: false,
  }),
  methods: {
    show() {
      this.visible = !this.visible;
      this.$nextTick(() => this.$refs.dropdownMenu.focus());
    },
    hide() {
      this.visible = false;
    },
  },
};
</script>
