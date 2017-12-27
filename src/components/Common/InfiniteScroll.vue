<template>
  <div v-if="virtualScroll" v-bar>
    <div ref="scroll">
      <slot />
    </div> 
  </div>

  <div v-else ref="scroll">
    <slot />
  </div>
</template>

<script>
export default {
  name: 'InfiniteScroll',
  props: {
    virtualScroll: {
      type: Boolean,
      default: true,
    },
  },
  methods: {
    handleScroll(e) {
      const { clientHeight, scrollTop, scrollHeight } = e.target;

      if (scrollTop === 0) {
        this.$emit('top');
      } else if (scrollTop === scrollHeight - clientHeight) {
        this.$emit('bottom');
      } else {
        this.$emit('middle');
      }
    },
  },
  created() {
    this.$nextTick(() => {
      this.$refs.scroll.addEventListener('scroll', this.handleScroll);
    });
  },
  beforeDestroy() {
    this.$refs.scroll.removeEventListener('scroll', this.handleScroll);
  },
};
</script>
