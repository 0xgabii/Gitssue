<template>
  <div class="modal" ref="modal">
    <div class="modal__backdrop" @click="$emit('close')" />
    <div class="modal-wrapper">
      <div class="modal-header">
        <h3 class="modal-header__title">{{title}}</h3>        
      </div>
      <div class="modal-body">
        <slot />
      </div>
      <div class="modal-footer">
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