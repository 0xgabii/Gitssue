<template>
  <div class="contentsView-sidebar">
    
    <router-link 
      v-tooltip.right="`${user.name} | ${user.login}`"
      class="circle user"
      tag="div"
      to="lol">
      <img 
        class="user__profile"
        :src="user.avatarUrl" 
        :alt="user.name"
      />
    </router-link>

    <router-link 
      v-for="repo in repos"
      class="circle repo"
      tag="div"
      replace
      v-tooltip.right="`${repo.owner}/${repo.name}`"
      :key="repo.id"
      :to="{ name: 'Issues', params: { owner: repo.owner, name: repo.name } }">

      <span class="repo__name">
        {{repo.name.slice(0, 4)}}
      </span>
      
      <label v-if="repo.open_issues" class="repo__openIssues">
        {{repo.open_issues >= 100 ? '99+' : repo.open_issues}}
      </label>

    </router-link>

    <div class="circle repo repo--plus" @click="modals.repos = true">
      <i class="ion-ios-plus-empty" />
    </div>

    <add-repo-modal 
      v-show="modals.repos" 
      @close="modals.repos = false" 
    />

  </div>
</template>

<script>
import { mapState } from 'vuex';

import utils from '../../../helpers/utils';

import AddRepoModal from './AddRepoModal';

export default {
  name: 'ContentsViewSideBar',
  data: () => ({
    user: {
      login: '',
      name: '',
      avatarUrl: '',
    },

    repos: [],

    modals: {
      repos: false,
    },
  }),
  computed: {
    ...mapState('auth', [
      'token',
    ]),
  },
  methods: {
    getUser() {
      utils.request({
        token: this.token,
        query: `{
          viewer {
            login
            name
            avatarUrl
          }
        }` }).then(({ viewer }) => {
          this.user = {
            ...this.user,
            ...viewer,
          };
        });
    },
    getRepos() {
      utils.message('repos', { type: 'init' });
    },
    refreshRepos(list) {
      let query = '';

      list.forEach(({ name, owner }, index) => {
        query = `
          ${query}
          repo${index}: repository(owner: "${owner}" name: "${name}") {
            name
            owner {
              login
            }
            issues(states:OPEN) {
              totalCount
            }
          }
        `;
      });

      utils.request({
        token: this.token,
        query: `{
          ${query}  
        }`,
      }).then((repos) => {
        this.repos = Object.keys(repos).map((key) => {
          const { id, name, owner, issues } = repos[key];

          return {
            id,
            name,
            owner: owner.login,
            open_issues: issues.totalCount,
          };
        });
      });
    },
  },
  created() {
    this.getUser();
    this.getRepos();

    window.addEventListener('message', ({ data: { port, msg } }) => {
      if (port === 'repos') {
        this.refreshRepos(msg);
      }
    });
  },
  components: {
    AddRepoModal,
  },
};
</script>
