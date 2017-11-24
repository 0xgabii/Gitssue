<template>
  <div class="issuePage">
    
    <div class="header">

      <div class="info">
        <span
          v-for="label in issue.labels"
          class="info__tag"
          :key="label.id"
          :style="{ color: label.color, backgroundColor: label.bgColor }">
          {{label.name}}
        </span>

        <h2 class="info__title">{{issue.title}}</h2>
      </div>

      <span v-if="issue.comments" class="comments">
        <i class="ion-ios-chatboxes" /> {{issue.comments}}
      </span>

    </div>

    <div class="content">

      <template>
        <loading-spinner v-if="loading.issue" />
        <div v-else class="main markdown-preview" v-html="issue.bodyHTML" />
      </template>

      <template>
        <loading-spinner v-if="loading.comments" />
        <div v-else class="comments">
          <div 
            class="comment markdown-preview"
            v-for="comment in comments"
            :key="comment.id"
            v-html="comment.bodyHTML"
          />
        </div>
      </template>

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
  highlight: str => hljs.highlightAuto(str).value,
  breaks: true,
});

export default {
  name: 'IssuePage',
  data: () => ({
    issue: {},
    comments: [],

    loading: {
      issue: false,
      comments: false,
    },
  }),
  computed: {
    ...mapState('auth', [
      'token',
    ]),
  },
  watch: {
    $route() {
      this.issue = {};
      this.comments = [];

      this.requestIssue();
    },
  },
  methods: {
    requestIssue() {
      const { owner, name, number } = this.$route.params;

      this.loading.issue = true;

      utils.request({
        token: this.token,
        query: `{
          repository(owner: "${owner}" name: "${name}") {
            issue(number: ${number}) {
              id
              title
              author {
                login
              }
              labels (first: 5) {
                edges {
                  node {
                    id
                    name
                    color
                  }
                }
              }
              body
              createdAt
              comments {
                totalCount
              }
            }
          }
        }`,
      }).then(({ repository: { issue } }) => {
        this.issue = {
          ...issue,
          author: issue.author.login,
          labels: issue.labels ? issue.labels.edges.map(({ node }) => ({
            id: node.id,
            name: node.name,
            color: parseInt('ffffff', 16) / 2 > parseInt(node.color, 16) ? '#fff' : '#000',
            bgColor: `#${node.color}`,
          })) : [],
          bodyHTML: marked(issue.body),
          comments: issue.comments.totalCount,
        };

        this.loading.issue = false;

        if (issue.comments.totalCount) this.requestComments(issue.comments.totalCount);
      });
    },
    requestComments(num) {
      const { owner, name, number } = this.$route.params;

      this.loading.comments = true;

      utils.request({
        token: this.token,
        query: `{
          repository(owner: "${owner}" name: "${name}") {
            issue(number: ${number}) {
              comments(first: ${num}) {
                edges {
                  node {
                    id
                    body
                    createdAt
                  }
                }
              }
            }
          }
        }`,
      }).then(({ repository: { issue } }) => {
        this.comments = issue.comments.edges.map(({ node }) => ({
          id: node.id,
          bodyHTML: marked(node.body),
        }));

        this.loading.comments = false;
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