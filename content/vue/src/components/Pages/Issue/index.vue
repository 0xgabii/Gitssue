<template>
  <div class="issuePage">

    <header class="header">

      <div class="info">
        <span
          v-for="label in info.labels"
          class="info__tag"
          :key="label.id"
          :style="{ color: label.color, backgroundColor: label.bgColor }">
          {{label.name}}
        </span>

        <h2 class="info__title">{{info.title}}</h2>
      </div>

      <span v-if="info.comments" class="comments">
        <i class="ion-ios-chatboxes" /> {{info.comments}}
      </span>

    </header>

    <section class="content">

      <loading-spinner v-if="loading" />
      
      <div v-else class="timeline">
        <div
          class="timeline-item"
          v-for="event in timeline"
          :key="event.id">
          <component 
            :is="event.__typename" 
            :data="event"
          />
        </div>
      </div>

    </section>

  </div>
</template>

<script>
import { mapState } from 'vuex';

import utils from '../../../helpers/utils';

import IssueComment from './IssueComment';
import ClosedEvent from './ClosedEvent';
import ReopenedEvent from './ReopenedEvent';

export default {
  name: 'IssuePage',
  data: () => ({
    info: {},
    timeline: [],

    loading: false,
  }),
  computed: {
    ...mapState('auth', [
      'token',
    ]),
  },
  watch: {
    $route() {
      this.info = {};
      this.timeline = [];

      this.requestIssue();
    },
  },
  methods: {
    requestIssue() {
      const { owner, name, number } = this.$route.params;

      this.loading = true;

      utils.request({
        token: this.token,
        query: `{
          repository(owner: "${owner}" name: "${name}") {
            issue(number: ${number}) {
              id
              title
              author {
                avatarUrl
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
        this.info = {
          title: issue.title,
          labels: issue.labels ? issue.labels.nodes.map(node => ({
            id: node.id,
            name: node.name,
            color: parseInt('ffffff', 16) / 2 > parseInt(node.color, 16) ? '#fff' : '#000',
            bgColor: `#${node.color}`,
          })) : [],
          comments: issue.comments.totalCount,
        };

        this.timeline.push({
          __typename: 'IssueComment',
          ...issue,
        });

        this.loading = false;

        if (issue.timeline.totalCount) this.requestTimeline(issue.timeline.totalCount);
      });
    },
    requestTimeline(num) {
      const { owner, name, number } = this.$route.params;

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
        this.timeline = [
          ...this.timeline,
          ...issue.timeline.nodes.filter(node => Object.keys(node).length > 1),
        ];
      });
    },
  },
  created() {
    this.requestIssue();
  },
  components: {
    IssueComment,
    ClosedEvent,
    ReopenedEvent,
  },
};
</script>