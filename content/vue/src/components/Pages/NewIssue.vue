<template>
  <div>
    <input v-model="title" />
    <mditor v-model="content" />

    <button @click="submit">Submit new issue</button>
  </div>
</template>

<script>
import { mapState } from 'vuex';

import utils from '../../helpers/utils';

import Mditor from '../Mditor';

export default {
  name: 'NewIssue',
  data: () => ({
    title: '',
    content: '',
  }),
  computed: {
    ...mapState('auth', [
      'token',
    ]),
  },
  methods: {
    submit() {
      const { owner, name } = this.$route.params;

      if (!this.title.length) {
        alert('title required!');
        return;
      }

      utils.requestRest({
        url: `/repos/${owner}/${name}/issues`,
        method: 'post',
        params: {
          access_token: this.token,
        },
        data: {
          title: this.title,
          body: this.content,
        },
      });
    },
  },
  components: {
    Mditor,
  },
};
</script>
