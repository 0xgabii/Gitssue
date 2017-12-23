<template>
  <modal 
    class="reposModal"
    @close="$emit('close')">

    <template slot="header">
      
      <h3 class="title">
        Search & Select repositories
      </h3>

      <div class="tagsinput">
        <span 
          v-for="(item, index) in select"
          :key="item.id"
          class="tagsinput__tag"
          @click="cancelSelectByTag(index)">
          {{item.name}}
          <i class="ion-close-round" />
        </span>

        <input
          class="tagsinput__field"        
          :value="search"
          @keydown.delete="cancelSelectByInput"
          @keydown.enter="requestRepos"
          @input="(e) => {
            const input = e.target.value;
            e.target.style.width = `${input.length * 8}px`;
            search = input;
          }"
        />

        <div 
          v-show="!select.length && !search"
          class="tagsinput__placeholder">
          Please enter repository name
        </div>

      </div>

    </template>

    <template slot="body">
      
      <div
        :class="`
          message
          ${message.active && 'message--active'}
        `"
        @click="message.active = false">
        {{message.content}} <i class="ion-close-round" />
      </div>

      <infinite-scroll
        class="repos"
        :virtual-scroll="false"
        @bottom="requestMoreRepos">

        <loading-spinner v-if="loading" />

        <div
          v-else
          v-for="repo in repos.list"
          class="repo"
          :key="repo.id"
          @click="() => repo.hasIssuesEnabled && handleSelectRepo(repo)">

          <h3 class="repo__name">
            {{repo.owner}}/{{repo.name}}
          </h3>

          <p v-if="repo.description" class="repo__description">
            {{repo.description}}
          </p>

          <span v-if="repo.open_issues" class="repo__issues">
            {{repo.open_issues}}
          </span>

          <i 
            :class="`
              ion-checkmark-round
              repo__checkmark
              ${isRepoSelected(repo) && 'repo__checkmark--active'}
            `" 
          />

          <div v-if="!repo.hasIssuesEnabled" class="repo__blocked" />

        </div>

        <loading-spinner v-if="fetching" />

      </infinite-scroll>
        
    </template>
    
    <template slot="footer">
      <button 
        :class="`
          submit
          ${!select.length && 'submit--disabled'}
        `"
        @click="submitSelectedRepos">
        {{select.length
          ? `Add ${select.length} ${select.length === 1 ? 'repository' : 'repositories'} to manage`
          : 'Select repositories to manage'
        }}
      </button>
    </template>

  </modal>
</template>

<script>
import { mapState } from 'vuex';

import utils from '../../../helpers/utils';

export default {
  name: 'AddRepoModal',
  data: () => ({
    select: [],
    search: '',

    message: {
      active: false,
      content: '',
    },

    repos: {
      list: [],
      pageInfo: {},
    },

    loading: false,
    fetching: false,
  }),
  computed: {
    ...mapState('auth', [
      'token',
    ]),
  },
  methods: {
    submitSelectedRepos() {
      utils.message('repos', { type: 'addRepo', value: this.select });
      this.$emit('close');
    },

    cancelSelectByTag(index) {
      this.select = this.select.filter((item, idx) => idx !== index);
    },
    cancelSelectByInput() {
      if (!this.search.length) {
        this.select = this.select.filter((item, idx) => idx !== this.select.length - 1);
      }
    },
    isRepoSelected(repo) {
      return this.select.map(item => item.id).indexOf(repo.id) > -1;
    },
    handleSelectRepo(repo) {
      if (this.isRepoSelected(repo)) {
        this.select = this.select.filter(item => item.id !== repo.id);
      } else {
        this.select = [
          ...this.select,
          repo,
        ];
      }
    },

    requestRepos(appendList = [], pagingOption = '') {
      if (appendList.length) {
        this.fetching = true;
      } else {
        this.loading = true;
      }

      utils.request({
        token: this.token,
        query: `{
          search(first:20 type:REPOSITORY query:"${this.search}" ${pagingOption}) {
            repositoryCount
            pageInfo {
              hasNextPage
              endCursor
            }
            nodes {
              ... on Repository {
                id
                name
                description
                owner {
                  login
                }
                issues(states:OPEN) {
                  totalCount
                }
                viewerCanAdminister
                hasIssuesEnabled
              }
            }
          }
        }`,
      }).then(({ search }) => {
        if (appendList.length) {
          this.fetching = false;
        } else {
          this.loading = false;
        }

        this.repos = {
          list: [
            ...appendList,
            ...search.nodes.map(({
              id,
              name,
              description,
              owner,
              issues,
              viewerCanAdminister,
              hasIssuesEnabled,
            }) => ({
              id,
              name,
              description,
              owner: owner.login,
              open_issues: issues.totalCount,
              viewerCanAdminister,
              hasIssuesEnabled,
            })),
          ],
          pageInfo: search.pageInfo,
        };

        if (!appendList.length) {
          this.message = {
            active: true,
            content: search.repositoryCount
              ? `${search.repositoryCount} repository results`
              : `We couldn’t find any repositories matching '${this.search}'`,
          };

          setTimeout(() => {
            this.message.active = false;
          }, 3000);
        }
      });
    },
    requestMoreRepos() {
      const { hasNextPage, endCursor } = this.repos.pageInfo;

      if (hasNextPage) {
        this.requestRepos(this.repos.list, `after: "${endCursor}"`);
      }
    },
    requestMyInfo() {
      utils.request({
        token: this.token,
        query: `{
          viewer {
            login
          }
        }`,
      }).then(({ viewer }) => {
        this.search = `user:${viewer.login}`;
        this.requestRepos();
      });
    },
  },
  created() {
    this.requestMyInfo();
  },
};
</script>