<template>
  <time class="relativeTime" :datetime="utc">{{timeago}}</time>
</template>

<script>
import timeago from 'timeago.js';

const timeagoInstance = timeago();

export default {
  name: 'RelativeTime',
  props: {
    utc: String,
  },
  computed: {
    timeago() {
      return timeagoInstance.format(this.utc, 'en');
    },
  },
};
</script>
