<template>
  <div class="issue">

    <!-- main -->
    <template>

      <loading-spinner v-if="loading.content" />

      <template v-else>

        <div class="issue-info">
          {{extractIssue.title}}
        </div>

        <div class="main">
          <div class="main-info">
            <div>        
              <img class="main-info__profile" :src="extractIssue.author.profile" />
              <div class="main-info__author">
                <p>{{extractIssue.author.name}}</p>
                <span>created <relative-time :utc="extractIssue.time" /></span>
              </div>          
            </div>

            <button>
              <i class="ion-edit" />
              edi
            </button>
          </div>

          <div class="main__content markdown-preview" v-html="extractIssue.body" />
        </div>

      </template>

    </template>

    <!-- comments -->
    <template>

      <loading-spinner v-if="loading.comments" />

      <div 
        class="comment"
        v-else
        v-for="comment in extractComments"
        :key="comment.id">
        <div class="comment-info">
          <div>        
            <img class="comment-info__profile" :src="comment.author.profile" />
            <div class="comment-info__author">
              <p>{{comment.author.name}}</p>
              <span>commented <relative-time :utc="comment.time" /></span>
            </div>          
          </div>

          <button>
            <i class="ion-edit" />
            edit
          </button>
        </div>
        <div class="comment__content markdown-preview" v-html="comment.body" />
      </div>

    </template>

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
    },
  },
  methods: {
    requestIssue() {
      const { owner, name, issueId } = this.$route.params;

      this.loading.content = true;

      utils.requestGithub({
        url: `https://api.github.com/repos/${owner}/${name}/issues/${issueId}`,
        params: {
          access_token: this.token,
        },
      }).then((data) => {
        this.issue = data;
        this.loading.content = false;

        this.requestComments();
      });
    },
    requestComments() {
      const { owner, name, issueId } = this.$route.params;

      this.loading.content = true;

      utils.requestGithub({
        url: `https://api.github.com/repos/${owner}/${name}/issues/${issueId}/comments`,
        params: {
          access_token: this.token,
        },
      }).then((data) => {
        this.comments = data;
        this.loading.content = false;
      });

      /* utils.requestGithub({
        url: `https://api.github.com/repos/${owner}/${name}/issues/${issueId}/timeline`,
        headers: {
          Accept: 'application/vnd.github.mockingbird-preview',
        },
        params: {
          access_token: this.token,
        },
      }); */
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