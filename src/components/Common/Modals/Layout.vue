<template>
  <div class="modal" ref="modal">
    <div class="modal__backdrop" @click="$emit('close')" />
    <div class="modal-wrapper">
      
      <div class="modal-header">
        <slot name="header" />
      </div>

      <div class="modal-body">
        <slot name="body" />
      </div>

      <div class="modal-footer">
        <slot name="footer" />
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Modal',
  props: {
    title: String,
  },
  mounted() {
    document.querySelector('#app > div').appendChild(this.$refs.modal);
  },
};
</script>