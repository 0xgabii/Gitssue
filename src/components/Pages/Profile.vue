<template>
  <div class="profile board">

    <div class="board__title">
      Recent issues you've created
    </div>

    <div class="board-content">
      
      <div 
        class="repo"
        v-for="repo in repoWithIssues"
        :key="repo.name">

        <div class="repo-info">
          <h3>{{repo.owner}}/{{repo.name}}</h3>
          <router-link 
            class="ion-plus-round"
            v-tooltip.top="'Create new issue'"
            tag="i"            
            replace
            :to="{ name: 'NewIssue', params: { owner: repo.owner, name: repo.name } }"
          />
        </div>

        <div class="repo-issues">

          <router-link
            v-for="issue in repo.issues"
            tag="div"
            class="issue"
            replace
            :class="`issue--${issue.state.toLowerCase()}`"
            :key="issue.id"
            :to="{
              name: 'Issue',
              params: { 
                owner: issue.repository.owner,
                name: issue.repository.name ,
                number: issue.number 
              }
            }">
            
            <span
              v-for="label in issue.labels"
              class="issue__tag"
              :key="label.id"
              :style="{ color: label.color, backgroundColor: label.bgColor }">
              {{label.name}}
            </span>

            <h3 class="issue__title">
              {{issue.title}}
            </h3>

            <p class="issue-info">
              <span>
                <relative-time :utc="issue.time" />
              </span>
              <span v-if="issue.comments">
                <i class="ion-ios-chatboxes" />{{issue.comments}}
              </span>
            </p>
            
          </router-link>

        </div>

      </div>
      
    </div>

  </div>
</template>

<script>
import { mapState } from 'vuex';

import utils from '../../helpers/utils';

export default {
  name: 'Profile',
  data: () => ({
    user: {
      name: '',
      login: '',
      avatarUrl: '',
    },

    issues: [],
  }),
  computed: {
    ...mapState('resource', [
      'auth',
    ]),
    repoWithIssues() {
      const repos = [];

      this.issues.forEach(({ repository }) => {
        // eslint-disable-next-line        
        if (!repos.find(({ owner, name }) => {
          return repository.owner === owner && repository.name === name;
        })) {
          repos.push(repository);
        }
      });

      this.issues.forEach((item) => {
        // eslint-disable-next-line
        const findIndex = repos.findIndex(({ owner, name }) => {
          return item.repository.owner === owner && item.repository.name === name;
        });

        if (findIndex > -1) {
          repos[findIndex] = {
            ...repos[findIndex],
            issues: [
              ...repos[findIndex].issues || [],
              item,
            ],
          };
        }
      });

      return repos;
    },
  },
  methods: {
    request() {
      utils.request({
        token: this.auth,
        query: `{
          viewer {
            name
            login
            avatarUrl

            issues(first: 20 orderBy:{field:CREATED_AT direction:DESC}) {
              edges {
                node {
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
                  closed
                  createdAt
                  closedAt
                  comments {
                    totalCount
                  }
                  repository{
                    name
                    owner {
                      login
                    }
                  }
                }
              }
            }
          }
        }`,
      }).then(({ viewer }) => {
        this.user = {
          ...viewer,
        };

        this.issues = viewer.issues.edges.map(({ node: {
          id,
          number,
          title,
          author,
          labels,
          state,
          closed,
          closedAt,
          createdAt,
          comments,
          repository,
        } }) => ({
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
          time: closed ? closedAt : createdAt,
          comments: comments.totalCount,
          repository: {
            owner: repository.owner.login,
            name: repository.name,
          },
        }));

        this.requestNoti();
      });
    },
    requestNoti() {
      setInterval(() => {
        utils.requestRest({
          url: `https://api.github.com/users/${this.user.login}/events`,
          method: 'get',
          params: {
            access_token: this.auth,
          },
        }).then((events) => {
          const filteredEvent = events
                                  .filter(event => event.type === 'IssuesEvent' || event.type === 'IssueCommentEvent')
                                  .filter(event => !event.payload.issue.pull_request);

          const transform = filteredEvent.map(({
              id,
              actor,
              payload: { action, comment, issue },
              repo,
            }) => {
            const [owner, name] = repo.name.split('/');

            const structure = {
              id,
              contextMessage: repo.name,
              iconUrl: actor.avatar_url,
            };

            if (comment) {
              return {
                ...structure,
                title: comment.body,
                message: `comment in #${issue.number} by ${actor.login}`,
                route: {
                  name: 'Issue',
                  params: { owner, name, number: issue.number },
                  query: { comment: comment.id },
                },
              };
            }

            return {
              ...structure,
              title: issue.title,
              message: `#${issue.number} ${action} by ${actor.login}`,
              route: {
                name: 'Issue',
                params: { owner, name, number: issue.number },
              },
            };
          });

          utils.message('notifications', { type: 'saveNotis', value: transform });
        });
      }, 10000);
    },
  },
  created() {
    this.request();
  },
};
</script>