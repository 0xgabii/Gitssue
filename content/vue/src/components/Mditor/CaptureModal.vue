<template>
  <modal @close="handleClose">

    I want to screenshot

    <template v-if="!active">
      <button @click="init('full')">
        Full page
      </button>

      <button @click="init('visible')">
        Only visible
      </button>
    </template>

    <template v-else>
      <button @click="crop">
        Crop scrennshot
      </button>

      <button @click="cancel">
        Cancel screenshot
      </button>
    </template>

  </modal>
</template>

<script>
import { mapActions } from 'vuex';

import utils from '../../helpers/utils';

export default {
  name: 'CaptureModal',
  data: () => ({
    active: false,
    instance: undefined,
  }),
  methods: {
    ...mapActions('ui', [
      'changeUI',
    ]),
    init(type) {
      utils.message('capture', { type: 'init', value: type === 'full' });

      this.active = true;

      this.changeUI({ category: 'extend', value: false });

      window.addEventListener('message', this.handleMessage);
    },
    crop() {
      utils.message('capture', { type: 'crop' });
    },
    cancel() {
      utils.message('capture', { type: 'destroy' });

      this.active = false;

      window.removeEventListener('message', this.handleMessage);
    },
    handleMessage({ data: { port, msg } }) {
      if (port === 'capture') {
        prompt('Copy & paste this into markdown', `![](${msg.imgURL})`);
      }
    },
    handleClose() {
      if (this.active) this.cancel();
      this.$emit('close');
    },
  },
};
</script>
