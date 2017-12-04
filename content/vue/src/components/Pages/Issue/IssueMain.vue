<template>
  <div class="comment">
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
      </div>

      <div 
        class="comment-body">

        <template v-if="!edit">
          <div class="markdown-preview" v-html="markdown.html" />
        </template>

        <template v-else>

          <mditor v-model="markdown.text" />

          <button @click="edit = false">Cancel</button>
          <button @click="updateIssue">Update issue #{{$route.params.number}}</button>
        
        </template>
      </div>

    </div>
  </div>
</template>

<script>
import marked from 'marked';
import hljs from 'highlight.js';

import { mapState } from 'vuex';

import Mditor from '../../Mditor';

import utils from '../../../helpers/utils';

marked.setOptions({
  highlight: str => hljs.highlightAuto(str).value,
  breaks: true,
});

export default {
  name: 'IssueMain',
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
  methods: {
    updateIssue() {
      const { owner, name, number } = this.$route.params;

      utils.requestRest({
        url: `/repos/${owner}/${name}/issues/${number}`,
        method: 'patch',
        params: {
          access_token: this.token,
        },
        data: {
          body: this.markdown.text,
        },
      });
    },
  },
  created() {
    this.markdown.text = this.data.body;

    setTimeout(() => {
      marked(this.markdown.text, (err, html) => {
        if (err) throw err;
        this.markdown.html = html;
      });
    }, 0);
  },
  components: {
    Mditor,
  },
};
</script>

