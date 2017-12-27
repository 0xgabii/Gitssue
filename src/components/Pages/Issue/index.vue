<template>
  <placeholder v-if="placeholder" />
  <issue v-else />
</template>

<script>
import Issue from './Issue';
import Placeholder from './Placeholder';

export default {
  name: 'IssuePage',
  props: {
    placeholder: {
      type: Boolean,
      default: false,
    },
  },
  components: {
    Issue,
    Placeholder,
  },
};
</script>