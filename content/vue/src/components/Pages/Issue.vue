<template>
  <div class="issuePage">

    <div class="issue">

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

      <div id="scrollHelper-target" class="content">

        <template>
          <loading-spinner v-if="loading.issue" />
          <div v-else class="main markdown-preview" v-html="text2Markdown(issue.body)" />
        </template>

        <template>
          <loading-spinner v-if="loading.timeline" />
          <div v-else class="timeline">
            <div 
              class="timeline-event"
              v-for="(event, index) in timeline"
              :key="event.id">

              <template v-if="event.__typename === 'IssueComment'">
                <div class="comment">
                  <img 
                    class="comment__authorAvatar" 
                    :src="event.author.avatarUrl"
                  />

                  <div class="comment-body">
                    <h3 class="comment__authorName">
                      {{event.author.login}}
                      <relative-time :utc="event.createdAt" />
                    </h3>
                    <div 
                      class="comment-body__content markdown-preview" 
                      v-html="text2Markdown(event.body)"
                    />
                  </div>
                </div>
              </template>

              <template v-if="event.__typename === 'ClosedEvent'">
                <div class="closed">
                  <img 
                    class="closed__actorAvatar" 
                    :src="event.actor.avatarUrl"
                  />
                  <h3 class="closed__actorName">
                    {{event.actor.login}}
                    closed this
                    <relative-time :utc="event.createdAt" />
                  </h3>
                </div>
              </template>

              <template v-if="event.__typename === 'ReopenedEvent'">
                <div class="closed">
                  <img 
                    class="closed__actorAvatar" 
                    :src="event.actor.avatarUrl"
                  />
                  <h3 class="closed__actorName">
                    {{event.actor.login}}
                    reopened
                    <relative-time :utc="event.createdAt" />
                  </h3>
                </div>
              </template>

            </div>
          </div>
        </template>

      </div>

    </div>

    <div class="scrollHelper">
      
     <!--  <div 
        v-for="(comment, index) in comments"
        :key="comment.id"
        v-scroll-to="{
          el: `#comment-${index}`,
          container: '#scrollHelper-target'
        }">
        <img 
          :src="comment.author.avatarUrl"
        />
      </div> -->

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
    timeline: [],

    loading: {
      issue: false,
      timeline: false,
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
    text2Markdown(text) {
      return marked(text);
    },
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
                nodes {
                  id
                  name
                  color
                }
              }
              body
              createdAt
              comments {
                totalCount
              }
              timeline {
                totalCount
              }
            }
          }
        }`,
      }).then(({ repository: { issue } }) => {
        this.issue = {
          ...issue,
          author: issue.author.login,
          labels: issue.labels ? issue.labels.nodes.map(node => ({
            id: node.id,
            name: node.name,
            color: parseInt('ffffff', 16) / 2 > parseInt(node.color, 16) ? '#fff' : '#000',
            bgColor: `#${node.color}`,
          })) : [],
          comments: issue.comments.totalCount,
        };

        this.loading.issue = false;

        if (issue.timeline.totalCount) this.requestTimeline(issue.timeline.totalCount);
      });
    },
    requestTimeline(num) {
      const { owner, name, number } = this.$route.params;

      this.loading.timeline = true;

      utils.request({
        token: this.token,
        query: `{
          repository(owner: "${owner}" name: "${name}") {
            issue(number: ${number}) {
              timeline(first: ${num}) {
                nodes {
                  __typename
                  ... on Comment {
                    id
                    author {
                      avatarUrl
                      login
                    }
                    body
                    createdAt
                  }
                  ... on ClosedEvent {
                    id
                    actor {
                      avatarUrl
                      login
                    }
                    createdAt
                  }
                  ... on ReopenedEvent {
                    id
                    actor {
                      avatarUrl
                      login
                    }
                    createdAt
                  }
                }
              }
            }
          }
        }`,
      }).then(({ repository: { issue } }) => {
        this.timeline = issue.timeline.nodes.filter(node => Object.keys(node).length > 1);

        this.loading.timeline = false;
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