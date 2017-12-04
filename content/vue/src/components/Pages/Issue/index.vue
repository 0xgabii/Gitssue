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

    <section class="content custom-scroll">

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

        <div class="timeline-item">
          <add-comment
            :info="info"
            :viewer="viewer" 
          />
        </div>
      </div>

    </section>

  </div>
</template>

<script>
import { mapState } from 'vuex';

import utils from '../../../helpers/utils';

import IssueMain from './IssueMain';
import IssueComment from './IssueComment';
import ClosedEvent from './ClosedEvent';
import ReopenedEvent from './ReopenedEvent';
import AddComment from './AddComment';

export default {
  name: 'IssuePage',
  data: () => ({
    info: {},
    timeline: [],
    viewer: {},
    loading: false,
  }),
  computed: {
    ...mapState('auth', [
      'token',
    ]),
  },
  watch: {
    $route() {
      this.requestIssue();
    },
  },
  methods: {
    requestIssue() {
      const { owner, name, number } = this.$route.params;

      this.info = {};
      this.timeline = [];
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
              viewerCanUpdate
              labels (first: 5) {
                nodes {
                  id
                  name
                  color
                }
              }
              body
              closed
              createdAt
              comments {
                totalCount
              }
              timeline {
                totalCount
              }
            }
          }
          viewer {
            login
            avatarUrl
          }
        }`,
      }).then(({ viewer, repository: { issue } }) => {
        this.info = {
          title: issue.title,
          labels: issue.labels ? issue.labels.nodes.map(node => ({
            id: node.id,
            name: node.name,
            color: parseInt('ffffff', 16) / 2 > parseInt(node.color, 16) ? '#fff' : '#000',
            bgColor: `#${node.color}`,
          })) : [],
          comments: issue.comments.totalCount,
          viewerCanUpdate: issue.viewerCanUpdate,
          closed: issue.closed,
        };

        this.viewer = {
          ...viewer,
        };

        this.timeline.push({
          __typename: 'IssueMain',
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
                  ... on IssueComment {
                    id
                    databaseId
                    author {
                      avatarUrl
                      login
                    }
                    viewerCanDelete
                    viewerCanUpdate
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
    IssueMain,
    IssueComment,
    ClosedEvent,
    ReopenedEvent,
    AddComment,
  },
};
</script>