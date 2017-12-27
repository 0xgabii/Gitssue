<template>
  <dropdown 
    name="Capture"
    ref="dropdown">
    <dropdown-item @click.native="capture('full')">
      Capture entire page
    </dropdown-item>
    <dropdown-item @click.native="capture('visible')">
      Capture only visible
    </dropdown-item>
  </dropdown>
</template>

<script>
import utils from '../../helpers/utils';

export default {
  name: 'CaptureDropdown',
  methods: {
    capture(type) {
      console.log(type);
      utils.message('capture', { type: 'init', value: type });
      this.$refs.dropdown.hide();
    },
  },
};
</script>
