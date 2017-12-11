<template>
  <div class="newIssue">

    <input
      placeholder="Title"
      :value="title"
      @input="e => title = e.target.value"      
      @keydown.tab="handleTab"
    />

    <mditor 
      v-model="content"
      ref="mditor"
      :min-height="200"
    />

    <div class="newIssue-control">
      <button 
        class="newIssue-control__button"
        :class="{'newIssue-control__button--disabled': submitDisabled}"
        @click="submit">
        {{submitText}}
      </button>
    </div>

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

    isSending: false,
  }),
  computed: {
    ...mapState('auth', [
      'token',
    ]),
    submitDisabled() {
      return !this.title.length || this.isSending;
    },
    submitText() {
      if (this.isSending) {
        return 'Sending issue...';
      }

      return 'Submit new issue';
    },
  },
  methods: {
    handleTab() {
      setTimeout(() => {
        this.$refs.mditor.$el.getElementsByTagName('textarea')[0].focus();
      }, 0);
    },
    submit() {
      const { owner, name } = this.$route.params;

      if (!this.title.length) return;

      this.isSending = true;

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
      }).then(({ number }) => {
        this.isSending = false;
        this.$router.replace({ name: 'Issue', params: { owner, name, number } });
      });
    },
  },
  components: {
    Mditor,
  },
};
</script>
