<template>
  <div class="issuesWrapper">

    <div class="issuesPage" v-bar>
      <div>

        <div class="control">

          <input 
            v-model="search"
            class="control__search"
            placeholder="Search all issues"
            @keydown.enter="requestIssues"
          />
          
          open / closed

        </div>

        <div class="issues">

          <router-link 
            tag="div"
            class="issue"          
            replace
            :to="{ name: 'NewIssue' }">
            <h3 class="issue__title">Create new issue</h3>
          </router-link>

          <router-link 
            v-for="issue in issues"
            tag="div"
            class="issue"          
            replace
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
    </div>
    
    <router-view class="router-view" />

  </div>
</template>

<script>
import { mapState } from 'vuex';

import utils from '../../helpers/utils';

export default {
  name: 'IssuesPage',
  data: () => ({
    search: '',
    states: 'open',
    issues: [],
    loading: false,
  }),
  computed: {
    ...mapState('auth', [
      'token',
    ]),
  },
  watch: {
    $route(to) {
      if (!to.params.number) this.requestIssues();
    },
  },
  methods: {
    requestIssues() {
      const { owner, name } = this.$route.params;

      const info = `is:issue repo:${owner}/${name}`;
      const states = `${this.states ? `is:${this.states}` : ''}`;

      utils.request({
        token: this.token,
        query: `{
          search(first:20 type:ISSUE query:"${this.search} ${states} ${info}") {
            nodes {
              ... on Issue {
                id
                number
                title
                author {
                  login
                }
                labels (first: 3) {
                  nodes {
                    id
                    name
                    color
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
          openIssues: search(type:ISSUE query:"${this.search} is:open ${info}") {
            issueCount
          }
          closedIssues: search(type:ISSUE query:"${this.search} is:closed ${info}") {
            issueCount
          }
        }`,
      }).then(({ search, openIssues, closedIssues }) => {
        console.log(openIssues, closedIssues);
        this.issues = search.nodes.map(({
          id,
          number,
          title,
          author,
          labels,
          state,
          createdAt,
          comments,
        }) => ({
          id,
          number,
          title,
          author: author.login,
          labels: labels ? labels.nodes.map(node => ({
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
};
</script>