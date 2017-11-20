<template>
  <div class="issuesPage">

    <div class="issues" v-bar>

      <div>

        <router-link 
          class="issue"
          v-for="issue in issues"
          tag="div"
          :key="issue.id"
          :to="{ name: 'Issue', params: { number: issue.number } }">
          {{ issue.title }}
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
    list: [],
    issues: [],
    loading: false,
  }),
  computed: {
    ...mapState('auth', [
      'token',
    ]),
    extractList() {
      if (!this.list.length) return [];

      return this.list.map(({
        id,
        state,
        title,
        number,
        labels,
        comments,
        user,
        created_at,
        closed_at,
      }) => ({
        id,
        title,
        number,
        labels: labels.map(({ name, color }) => ({ name, color: `#${color}` })),
        comments_count: comments,
        author: user.login,
        state: state === 'open' ? 'opened' : 'closed',
        time: state === 'open' ? created_at : closed_at,
      }));
    },
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
            issues(first: 15 orderBy: {field: CREATED_AT, direction: DESC} states: OPEN) {
              edges {
                node {
                  id,
                  number,
                  title,
                  createdAt
                }
              }
            }
          }
        }`,
      }).then(({ repository }) => {
        this.issues = repository.issues.edges.map(({ node }) => ({
          id: node.id,
          number: node.number,
          title: node.title,
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