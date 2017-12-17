<template>
  <modal-layout 
    class="reposModal" 
    @close="$emit('close')">

    <template slot="header">
      
      <h3 class="title">
        Select repos want to manage issue
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
          @input="(e) => search = e.target.value"
        />

        <div 
          v-if="!select.length && !search.length"
          class="tagsinput__placeholder">
          Please enter repository name
        </div>
      </div>
    </template>

    <template slot="body">

      <div
        v-for="repo in repos"
        class="repo"
        :key="repo.id"
        @click="() => repo.hasIssuesEnabled && handleSelectRepo(repo)">

        <h3 class="repo__name">
          {{repo.owner}}/{{repo.name}}
        </h3>

        <p class="repo__description">
          {{repo.description}}
        </p>

        <span v-if="repo.open_issues" class="repo__issues">
          {{repo.open_issues}}
        </span>

        <div v-if="!repo.hasIssuesEnabled" class="repo__blocked" />

      </div>
        
    </template>
    
    <template slot="footer">
      <button 
        :class="`
          submit
          ${!select.length && 'submit--disabled'}
        `"
        @click="submitSelect">
        Select repos
      </button>
    </template>

  </modal-layout>
</template>

<script>
import { mapState } from 'vuex';

import ModalLayout from '../../Common/Modals/Layout';

import utils from '../../../helpers/utils';

export default {
  name: 'AddRepoModal',
  data: () => ({
    select: [],
    search: '',

    repos: [],

    loading: false,
  }),
  computed: {
    ...mapState('auth', [
      'token',
    ]),
  },
  methods: {
    submitSelect() {
      utils.message('repos', { type: 'addRepo', value: this.select });
    },
    cancelSelectByTag(index) {
      this.select = this.select.filter((item, idx) => idx !== index);
    },
    cancelSelectByInput() {
      if (!this.search.length) {
        this.select = this.select.filter((item, idx) => idx !== this.select.length - 1);
      }
    },
    handleSelectRepo(repo) {
      if (this.select.map(item => item.id).indexOf(repo.id) > -1) {
        this.select = this.select.filter(item => item.id !== repo.id);
      } else {
        this.select = [
          ...this.select,
          repo,
        ];
      }
    },
    searchRepos(query) {
      this.loading = true;

      utils.request({
        token: this.token,
        query: `{
          search(first:30 type:REPOSITORY query:"${query}") {
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
        this.repos = search.nodes.map(({
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
          $isDisabled: !hasIssuesEnabled,
        }));

        this.loading = false;
      });
    },
    requestMyRepos(pagingOpt = '') {
      utils.request({
        token: this.token,
        query: `{
          viewer {
            repositories(first: 15 ${pagingOpt} orderBy: {field: PUSHED_AT direction: DESC}) {
              totalCount
              pageInfo {
                hasNextPage
                endCursor
              }
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
                viewerCanAdminister
                hasIssuesEnabled
              }
            }
          }
        }`,
      }).then(({ viewer: { repositories } }) => {
        this.repos = repositories.nodes.map(({
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
        }));
      });
    },
  },
  created() {
    this.requestMyRepos();
  },
  components: {
    ModalLayout,
  },
};
</script>