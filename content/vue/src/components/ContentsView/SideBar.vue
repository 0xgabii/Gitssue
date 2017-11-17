<template>
  <div class="contentsView-sidebar">
    sidebar
  </div>
</template>

<script>
import axios from 'axios';
import { mapState } from 'vuex';

export default {
  name: 'ContentsViewSideBar',
  computed: {
    ...mapState('auth', [
      'token',
    ]),
  },
};
</script>
