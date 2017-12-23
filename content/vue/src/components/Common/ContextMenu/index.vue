<template>
  <div
    v-show="visible"
    class="contextMenu"
    :style="position"
    tabindex="-1"
    @blur="visible = false"
    @contextmenu.prevent>
    <slot :data="data" />
  </div>  
</template>

<script>
export default {
  name: 'ContextMenu',
  data: () => ({
    visible: false,
    x: 0,
    y: 0,
    data: undefined,
  }),
  computed: {
    position() {
      return {
        top: `${this.y}px`, // document.body.scrollTop
        left: `${this.x}px`,
      };
    },
  },
  methods: {
    show(e, data) {
      this.visible = true;
      this.x = e.pageX || e.clientX;
      this.y = e.pageY || e.clientY;
      this.data = data;
      this.$nextTick(() => this.$el.focus());
    },
    hide() {
      Object.assign(this.$data, this.$options.data());
    },
  },
  mounted() {
    document.body.appendChild(this.$el);
  },
};
</script>

