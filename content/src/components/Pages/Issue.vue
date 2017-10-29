<template>
  <div class="issuePage">
    
    <div class="markdown-preview" v-html="extractIssue.body">
      
    </div>
    
    <div>
      
      <ul>
        <li 
          v-for="comment in comments"
          :key="comment.id"
          class="markdown-preview"
          v-html="comment.body">
        </li>
      </ul>

    </div>
  </div>
</template>

<script>
import marked from 'marked';
import hljs from 'highlight.js';

import { mapState } from 'vuex';

import utils from '../../helpers/utils';

marked.setOptions({
  highlight: code => hljs.highlightAuto(code).value,
  breaks: true,
});

export default {
  name: 'IssuePage',
  props: {
    url: {
      type: String,
      required: true,
    },
  },
  data: () => ({
    issue: {},
    comments: [],
  }),
  computed: {
    ...mapState('auth', [
      'token',
    ]),
    extractIssue() {
      if (!Object.keys(this.issue).length) return {};

      const {
        id,
        labels,
        state,
        title,
        body,
        user,
        created_at,
      } = this.issue;

      return {
        id,
        labels: labels.map(({ name, color }) => ({ name, color: `#${color}` })),
        state,
        title,
        body: marked(body),
        author: {
          profile: user.avatar_url,
          name: user.login,
        },
        created_at, // https://github.com/github/time-elements
      };
    },
  },
  methods: {
    requestIssue() {
      utils.requestGithub({
        url: this.url,
        params: {
          access_token: this.token,
        },
      }).then((data) => {
        this.issue = data;
      });
    },
    requestComments() {
      utils.requestGithub({
        url: `${this.url}/comments`,
        params: {
          access_token: this.token,
        },
      }).then((data) => {
        this.comments = data;
      });
    },
  },
  created() {
    this.requestIssue();
    this.requestComments();
  },
};
</script>