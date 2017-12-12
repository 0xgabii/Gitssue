<template>
  <div class="placeholder">

    <div class="center">
      
      <i class="placeholder__icon ion-document-text" />

      <p class="placeholder__message">
        Click item on the left to view the issue.
      </p>
      
      <div class="placeholder__divider" />

      <button
        class="placeholder__button"
        @click="move">
        Create new issue
      </button>

    </div>

  </div>
</template>

<script>
export default {
  name: 'Placeholder',
  methods: {
    move() {
      this.$router.replace({ name: 'NewIssue' });
    },
  },
};
</script>
