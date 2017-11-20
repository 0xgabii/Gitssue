<template>
  <div class="issuePage">
    
    <div class="header">
      #{{issue.number}} | {{issue.title}}
    </div>

    <div class="issue" v-bar>

      <div>

        <div class="main markdown-preview" v-html="issue.bodyHTML" />

        <div class="comments">
          <div 
            class="comment markdown-preview"
            v-for="comment in comments"
            :key="comment.id"
            v-html="comment.bodyHTML"
          />
        </div>

      </div>

    </div>

  </div>
</template>

<script>
import marked from 'marked';
import hljs from 'highlight.js';

import { mapState } from 'vuex';

import RelativeTime from '../Common/RelativeTime';
import LoadingSpinner from '../Common/LoadingSpinner';

import utils from '../../helpers/utils';

marked.setOptions({
  highlight: code => hljs.highlightAuto(code).value,
  breaks: true,
});

export default {
  name: 'IssuePage',
  data: () => ({
    issue: {},
    comments: [],
    loading: {
      content: false,
      comments: false,
    },
  }),
  computed: {
    ...mapState('auth', [
      'token',
    ]),
    /*
    extractIssue() {
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
    }, */
  },
  watch: {
    $route() {
      this.requestIssue();
    },
  },
  methods: {
    requestIssue() {
      const { owner, name, number } = this.$route.params;

      utils.request({
        token: this.token,
        query: `{
          repository(owner: "${owner}" name: "${name}") {
            issue(number: ${number}) {
              id,
              number,
              title,
              bodyHTML,
              comments(first: 10) {
                edges {
                  node {
                    id,
                    bodyHTML,
                  }
                }
              }
            }
          }
        }`,
      }).then(({ repository }) => {
        this.issue = repository.issue;
        this.comments = repository.issue.comments.edges.map(({ node }) => ({
          id: node.id,
          bodyHTML: node.bodyHTML,
        }));
      });
    },
  },
  created() {
    this.requestIssue();
  },
  components: {
    RelativeTime,
    LoadingSpinner,
  },
};
</script>