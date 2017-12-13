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

        <div class="comment-actions">

          <button 
            v-if="info.viewerCanUpdate"
            :class="`
              comment-actions__button 
              comment-actions__button--${info.closed ? 'reopen' : 'close'}
              ${loading.state ? 'comment-actions__button--disabled' : ''}
            `"
            @click="action">
            {{ actionText }}
          </button>

          <button 
            :class="`
              comment-actions__button 
              ${!comment.length ? 'comment-actions__button--disabled' : ''}
            `"
            @click="addComment">
            {{ loading.comment ? 'Sending comment...' : 'Comment' }}
          </button>
          
        </div>

      </div>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex';

import utils from '../../../../helpers/utils';

import Mditor from '../../../Mditor';

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
    loading: {
      comment: false,
      state: false,
    },
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

      if (!this.comment.length || this.loading.comment) return;

      this.loading.comment = true;

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
        this.loading.comment = false;
        this.comment = '';
        this.$emit('update');
      });
    },
    updateIssueState(state) {
      const { owner, name, number } = this.$route.params;

      if (this.loading.state) return;

      this.loading.state = true;

      utils.requestRest({
        url: `/repos/${owner}/${name}/issues/${number}`,
        method: 'patch',
        params: {
          access_token: this.token,
        },
        data: {
          state,
        },
      }).then(() => {
        this.loading.state = false;
        this.$emit('update');
      });
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

