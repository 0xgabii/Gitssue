<template>
  <div class="issuePage">
    
    <div class="markdown-preview" v-html="extractIssue.body">
      
    </div>

    <relative-time :utc="extractIssue.time" />

    <div>
      
      <ul>
        <li 
          v-for="comment in extractComments"
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

import RelativeTime from '../Common/RelativeTime';

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
        author_association,
        created_at,
        closed_at,
      } = this.issue;

      return {
        id,
        labels: labels.map(({ name, color }) => ({ name, color: `#${color}` })),
        title,
        body: marked(body),
        author: {
          profile: user.avatar_url,
          name: user.login,
          association: author_association,
        },
        state: state === 'open' ? 'opened' : 'closed',
        time: state === 'open' ? created_at : closed_at,
      };
    },
    extractComments() {
      return this.comments.map(({
        id,
        body,
        author_association,
        user,
        created_at,
      }) => ({
        id,
        body: marked(body),
        author: {
          profile: user.avatar_url,
          name: user.login,
          association: author_association,
        },
        time: created_at,
      }));
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

      utils.requestGithub({
        url: `${this.url}/timeline`,
        headers: {
          Accept: 'application/vnd.github.mockingbird-preview',
        },
        params: {
          access_token: this.token,
        },
      });
    },
  },
  created() {
    this.requestIssue();
    this.requestComments();
  },
  components: {
    RelativeTime,
  },
};
</script>