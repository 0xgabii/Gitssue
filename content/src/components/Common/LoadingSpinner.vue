<template>
  <div class="loadingSpinner">
    <grid-loader />
  </div>
</template>

<script>
import GridLoader from 'vue-spinner/src/GridLoader';

export default {
  name: 'LoadingSpinner',
  components: {
    GridLoader,
  },
};
</script>
