<template>
  <div class="contentsView-sidebar">
    <div>

      <router-link 
        class="user"
        tag="div"
        replace
        :to="{ name: 'Profile' }"
        @contextmenu.native.prevent="$refs.userContextMenu.show($event)">
        <img 
          v-tooltip.right="`${user.name} | ${user.login}`"          
          class="user__profile"
          :src="user.avatarUrl" 
          :alt="user.name"
        />
      </router-link>

      <div class="repos">
        <router-link 
          v-for="(repo, index) in repositories"
          class="repo"
          tag="div"
          replace
          v-tooltip.right="`${repo.owner}/${repo.name}`"
          :key="repo.id"
          :to="{ name: 'Issues', params: { owner: repo.owner, name: repo.name } }"
          @contextmenu.native.prevent="$refs.reposContextMenu.show($event, Object.assign({ index }, repo))">

          <span class="repo__name">
            {{repo.name.slice(0, 4)}}
          </span>
          
          <label v-if="repo.open_issues" class="repo__openIssues">
            {{repo.open_issues >= 100 ? '99+' : repo.open_issues}}
          </label>

        </router-link>

        <div 
          v-tooltip.right="'Click to add repos'"
          class="circle repo repo--plus" 
          @click="modals.repos = true">
          <i class="ion-ios-plus-empty" />
        </div>
      </div>

      <add-repo-modal 
        v-show="modals.repos" 
        @close="modals.repos = false" 
      />

      <context-menu ref="userContextMenu">
        <context-item
          type="warn"
          @click.native="signOut">
          Sign out from Gitssue
        </context-item>
      </context-menu>

      <context-menu ref="reposContextMenu">
        <template slot-scope="{ data }">
          <context-item>Mute notifications</context-item>
          <context-item
            type="warn"
            @click.native="removeManagedRepo(data)">
            No longer manage repo
          </context-item>
        </template>
      </context-menu>

    </div>
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

    repositories: [],

    modals: {
      repos: false,
    },
  }),
  computed: {
    ...mapState('resource', [
      'auth',
      'repos',
    ]),
  },
  watch: {
    repos: {
      handler(list) {
        this.refreshRepos(list);
      },
      immediate: true,
    },
  },
  methods: {
    signOut() {
      utils.message('auth', { type: 'signOut' });
      this.$refs.userContextMenu.hide();
    },

    getUser() {
      utils.request({
        token: this.auth,
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
    refreshRepos(list) {
      if (!list.length) {
        this.repositories = [];
        return;
      }

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
        token: this.auth,
        query: `{
          ${query}  
        }`,
      }).then((repos) => {
        this.repositories = Object.keys(repos).map((key) => {
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

    removeManagedRepo({ index }) {
      utils.message('repos', { type: 'removeRepo', value: index });
      this.$refs.reposContextMenu.hide();
    },
  },
  created() {
    this.getUser();
  },
  components: {
    AddRepoModal,
  },
};
</script>
