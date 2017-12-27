<template>
  <div :class="`comment comment--${data.databaseId}`">
    <div class="column column--left">
      <img
        class="comment__authorAvatar" 
        :src="data.author.avatarUrl"
      />
    </div>

    <div class="column column--right">
      <div class="comment-info">
        <h3 class="comment-info__authorName">
          {{data.author.login}}
        </h3>

        <relative-time 
          class="comment-info__createdAt"
          :utc="data.createdAt" 
        />
      </div>

      <div
        v-if="!edit"
        class="comment-control">
        <span
          v-if="data.viewerCanUpdate"
          class="comment-control__select comment-control__select--update"
          @click="edit = true">
          Edit
        </span>
        <span
          v-if="data.viewerCanDelete"
          class="comment-control__select comment-control__select--delete"
          @click="deleteComment">
          Delete
        </span>
      </div>

      <div 
        class="comment-body">

        <template v-if="!edit">
          <div class="markdown-preview" v-html="markdown.html" />
        </template>

        <template v-else>

          <mditor v-model="markdown.text" />

          <div class="comment-actions">
            <button 
              class="comment-actions__button comment-actions__button--cancel"
              @click="edit = false">Cancel</button>
            <button 
              class="comment-actions__button"
              @click="updateComment">Update comment</button>
          </div>
        
        </template>
      </div>

    </div>
  </div>
</template>

<script>
import marked from 'marked';
import hljs from 'highlight.js';

import { mapState } from 'vuex';

import Mditor from '../../../Mditor';

import utils from '../../../../helpers/utils';

marked.setOptions({
  highlight: str => hljs.highlightAuto(str).value,
  breaks: true,
});

export default {
  name: 'IssueComment',
  props: [
    'data',
  ],
  data: () => ({
    markdown: {
      text: '',
      html: '',
    },
    edit: false,
  }),
  computed: {
    ...mapState('auth', [
      'token',
    ]),
  },
  watch: {
    'data.body': function () {
      this.parseMarkdown();
    },
  },
  methods: {
    updateComment() {
      const { owner, name } = this.$route.params;

      this.edit = false;
      this.parseMarkdown(this.markdown.text);

      utils.requestRest({
        url: `/repos/${owner}/${name}/issues/comments/${this.data.databaseId}`,
        method: 'patch',
        params: {
          access_token: this.token,
        },
        data: {
          body: this.markdown.text,
        },
      }).then(() => this.$emit('update'));
    },
    deleteComment() {
      const { owner, name } = this.$route.params;

      if (!confirm('Are you sure you want to delete this comment?')) return;

      utils.requestRest({
        url: `/repos/${owner}/${name}/issues/comments/${this.data.databaseId}`,
        method: 'delete',
        params: {
          access_token: this.token,
        },
      }).then(() => this.$emit('update'));
    },
    parseMarkdown(text = this.data.body) {
      this.markdown.text = text;

      setTimeout(() => {
        marked(this.markdown.text, (err, html) => {
          if (err) throw err;
          this.markdown.html = html;
        });
      }, 0);
    },
  },
  created() {
    this.parseMarkdown();
  },
  components: {
    Mditor,
  },
};
</script>

