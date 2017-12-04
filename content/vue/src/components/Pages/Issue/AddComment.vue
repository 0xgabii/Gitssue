<template>
  <div class="comment">
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
          @click="addComment">
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
      });
    },
    updateIssueState() {
      const { owner, name, number } = this.$route.params;

      utils.requestRest({
        url: `/repos/${owner}/${name}/issues/${number}`,
        method: 'patch',
        params: {
          access_token: this.token,
        },
        data: {
          // state:
        },
      });
    },
  },
  components: {
    Mditor,
  },
};
</script>

