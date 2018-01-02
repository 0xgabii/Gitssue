<template>
  <div class="issuePage">

    <header class="header">

      <div class="info">
        <label class="info__number">#{{info.number}}</label>                
        <span 
          :class="`
            info__state
            info__state--${info.state}
          `">
          {{info.state}}
        </span>
        <h2 class="info__title">{{info.title}}</h2>
      </div>

      <span v-if="info.comments" class="comments">
        <i class="ion-ios-chatboxes" /> {{info.comments}}
      </span>

    </header>

    <section class="body">

      <section class="content custom-scroll">

        <loading-spinner v-if="loading" />
        
        <div v-else class="timeline">
          <div class="timeline-item">
            <issue-main
              :data="info"
              @update="requestIssue"
            />
          </div>

          <div
            v-for="event in timeline"
            class="timeline-item"
            :key="event.id">
            <component 
              :is="event.__typename" 
              :data="event"
              @update="requestIssue"
            />
          </div>

          <div class="timeline-item">
            <add-comment
              :info="info"
              :viewer="viewer"
              @update="requestIssue"
            />
          </div>
        </div>
  
      </section>

      <div class="sidebar">
        <div>

          <div class="sidebar-item">
            <h3 class="sidebar-item__name">Labels</h3>
            <div class="sidebar-item__content">
              <span
                v-for="label in info.labels"
                class="labels"
                :key="label.id"
                :style="{ color: label.color, backgroundColor: label.bgColor }">
                {{label.name}}
              </span>
              <p 
                v-if="info.labels && !info.labels.length"
                class="sidebar-item__placeholder">
                No Labels
              </p>
            </div>
          </div>

          <div class="sidebar-item">
            <h3 class="sidebar-item__name">Comments</h3>
            <div class="sidebar-item__content">
              <p 
                v-for="item in timeline"
                v-if="item.__typename === 'IssueComment'"
                v-scroll-to="{
                  el: `.comment--${item.databaseId}`,
                  container: '.issuePage .content',
                  offset: -25,
                }"
                class="comments"
                :key="item.id">
                <img :src="item.author.avatarUrl" />
                {{item.author.login}}     
              </p>
              <p 
                v-if="!info.comments"
                class="sidebar-item__placeholder">
                No Comments
              </p>
            </div>
          </div>

        </div>
      </div>

    </section>

  </div>
</template>

<script>
import { mapState } from 'vuex';

import utils from '../../../helpers/utils';

import IssueMain from './Timeline/IssueMain';
import IssueComment from './Timeline/IssueComment';
import ClosedEvent from './Timeline/ClosedEvent';
import ReopenedEvent from './Timeline/ReopenedEvent';
import AddComment from './Timeline/AddComment';

export default {
  name: 'Issue',
  data: () => ({
    info: {},
    timeline: [],
    viewer: {},
    loading: false,
  }),
  computed: {
    ...mapState('resource', [
      'auth',
    ]),
  },
  watch: {
    $route: {
      handler() {
        this.info = {};
        this.timeline = [];
        this.loading = true;

        this.requestIssue();
      },
      immediate: true,
    },
  },
  methods: {
    requestIssue() {
      const { owner, name, number } = this.$route.params;

      utils.request({
        token: this.auth,
        query: `{
          repository(owner: "${owner}" name: "${name}") {
            issue(number: ${number}) {
              id
              number
              state
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
          ...issue,
          labels: issue.labels ? issue.labels.nodes.map(node => ({
            id: node.id,
            name: node.name,
            color: parseInt('ffffff', 16) / 2 > parseInt(node.color, 16) ? '#fff' : '#000',
            bgColor: `#${node.color}`,
          })) : [],
          comments: issue.comments.totalCount,
          state: issue.state.toLowerCase(),
        };

        this.viewer = {
          ...viewer,
        };

        this.loading = false;

        if (issue.timeline.totalCount) this.requestTimeline(issue.timeline.totalCount);
      });
    },
    requestTimeline(num) {
      const { owner, name, number } = this.$route.params;

      utils.request({
        token: this.auth,
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
          ...issue.timeline.nodes.filter(node => Object.keys(node).length > 1),
        ];
      });
    },
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