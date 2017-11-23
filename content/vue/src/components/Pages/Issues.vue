<template>
  <div class="issuesPage">

    <div class="issues" v-bar>

      <div>

        <router-link 
          v-for="issue in issues"
          tag="div"
          class="issue"          
          :class="`issue--${issue.state.toLowerCase()}`"
          :key="issue.id"
          :to="{ name: 'Issue', params: { number: issue.number } }">

          <span
            v-for="label in issue.labels"
            class="issue__tag"
            :key="label.id"
            :style="{ color: label.color, backgroundColor: label.bgColor }">
            {{label.name}}
          </span>

          <h3 class="issue__title">{{issue.title}}</h3>

          <p class="issue-info">
            <span>
              {{issue.author}} - <relative-time :utc="issue.time" />
            </span>
            <span v-if="issue.comments">
              <i class="ion-ios-chatboxes" />{{issue.comments}}
            </span>
          </p>

        </router-link>
        
      </div>

    </div>
    
    <router-view class="router-view" />

  </div>
</template>

<script>
import { mapState } from 'vuex';

import RelativeTime from '../Common/RelativeTime';
import LoadingSpinner from '../Common/LoadingSpinner';

import utils from '../../helpers/utils';

export default {
  name: 'IssuesPage',
  data: () => ({
    issues: [],
    loading: false,
  }),
  computed: {
    ...mapState('auth', [
      'token',
    ]),
  },
  watch: {
    $route() {
      this.requestIssues();
    },
  },
  methods: {
    requestIssues() {
      const { owner, name } = this.$route.params;

      utils.request({
        token: this.token,
        query: `{
          repository(owner: "${owner}" name: "${name}") {
            issues(first: 10 orderBy: {field: CREATED_AT, direction: DESC}) {
              edges {
                node {
                  id
                  number
                  title
                  author {
                    login
                  }
                  labels (first: 3) {
                    edges {
                      node {
                        id
                        name
                        color
                      }
                    }
                  }
                  state
                  createdAt
                  comments {
                    totalCount
                  }
                }
              }
            }
          }
        }`,
      }).then(({ repository }) => {
        this.issues = repository.issues.edges.map(({ node: {
          id,
          number,
          title,
          author,
          labels,
          state,
          createdAt,
          comments,
        } }) => ({
          id,
          number,
          title,
          author: author.login,
          labels: labels ? labels.edges.map(({ node }) => ({
            id: node.id,
            name: node.name,
            color: parseInt('ffffff', 16) / 2 > parseInt(node.color, 16) ? '#fff' : '#000',
            bgColor: `#${node.color}`,
          })) : [],
          state,
          time: createdAt,
          comments: comments.totalCount,
        }));
      });
    },
  },
  created() {
    this.requestIssues();
  },
  components: {
    RelativeTime,
    LoadingSpinner,
  },
};
</script>