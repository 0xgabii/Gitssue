<template>
  <div class="comment" v-if="viewer">
    <div class="column column--left">
      <img 
        class="comment__authorAvatar" 
        :src="viewer.avatarUrl"
      />
    </div>

    <div class="column column--right">
      <div class="comment-info">
        <h3 class="comment-info__authorName">
          {{viewer.login}}
        </h3>
      </div>

      <div 
        class="comment-body">
        <mditor 
          v-model="comment"
          :placeholder="`Add comment for issue #${this.$route.params.number}`"
        />

        <button 
          v-if="info.viewerCanUpdate" 
          @click="action">
          {{ actionText }}
        </button>

        <button @click="addComment">Comment</button>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex';

import utils from '../../../helpers/utils';

import Mditor from '../../Mditor';

export default {
  name: 'AddComment',
  props: {
    info: {
      type: Object,
      required: true,
    },
    viewer: {
      type: Object,
      required: true,
    },
  },
  data: () => ({
    comment: '',
  }),
  computed: {
    ...mapState('auth', [
      'token',
    ]),
    actionText() {
      if (this.comment) {
        return this.info.closed ? 'Reopen & Comment' : 'Close & Comment';
      }

      return this.info.closed ? 'Reopen issue' : 'Close issue';
    },
  },
  methods: {
    addComment() {
      const { owner, name, number } = this.$route.params;

      utils.requestRest({
        url: `/repos/${owner}/${name}/issues/${number}/comments`,
        method: 'post',
        params: {
          access_token: this.token,
        },
        data: {
          body: this.comment,
        },
      }).then(() => {
        this.comment = '';
        this.$emit('update');
      });
    },
    updateIssueState(state) {
      const { owner, name, number } = this.$route.params;

      utils.requestRest({
        url: `/repos/${owner}/${name}/issues/${number}`,
        method: 'patch',
        params: {
          access_token: this.token,
        },
        data: {
          state,
        },
      }).then(() => this.$emit('update'));
    },
    action() {
      if (this.comment) this.addComment();

      this.updateIssueState(this.info.closed ? 'open' : 'closed');
    },
  },
  components: {
    Mditor,
  },
};
</script>

