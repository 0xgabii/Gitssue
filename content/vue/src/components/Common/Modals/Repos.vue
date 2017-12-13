<template>
  <modal-layout 
    class="reposModal" 
    title="Select repo to manage issues"
    @close="$emit('close')">
    
      <div>
        Yours / Search
      </div>

      <div 
        v-for="repo in repos"
        class="repo"
        :key="repo.id"
        @click="select(repo)">

        <div class="repo-info">
          <h3 class="repo__name">{{repo.name}}</h3>
          <p class="repo__description">{{repo.description}}</p>
        </div>

        <label class="repo__issue" v-if="repo.issues">
          {{repo.issues}}
        </label>
        
      </div>

  </modal-layout>
</template>

<script>
import { mapState } from 'vuex';

import ModalLayout from './Layout';

import utils from '../../../helpers/utils';

export default {
  name: 'ReposModal',
  data: () => ({
    repos: [],
  }),
  computed: {
    ...mapState('auth', [
      'token',
    ]),
  },
  methods: {
    select(repo) {
      utils.message('repos', { type: 'addRepo', value: repo });
    },
    getRepos() {
      utils.request({
        token: this.token,
        query: `{ 
          viewer {
            login
            repositories(first: 10, orderBy: { field:PUSHED_AT direction: DESC }) {
              nodes {
                id
                name
                description
                owner {
                  login
                }
                issues(states:OPEN) {
                  totalCount
                }
              }
            }
          }
        }`,
      }).then(({ viewer }) => {
        this.repos = viewer.repositories.nodes.map(({
          id,
          name,
          description,
          owner,
          issues,
        }) => ({
          id,
          name,
          description,
          owner: owner.login,
          open_issues: issues.totalCount,
        }));
      });
    },
  },
  created() {
    this.getRepos();
  },
  components: {
    ModalLayout,
  },
};
</script>