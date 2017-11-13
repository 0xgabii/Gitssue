<template>
  <div class="reposPage" v-if="$route.name === 'Repos'">
    <ul class="reposList">
      <router-link
        v-for="item in extractList"
        class="repo"
        tag="li"
        replace
        :key="item.id"
        :to="{ name: 'Issues', params: { owner: item.issues_route.owner, name: item.issues_route.name } }">

        <div class="repo-info">
          <h3>{{item.name}}</h3>
          <p>{{item.description}}</p>
        </div>

        <div
          class="repo-issue"
          :class="{'repo-issue--none': !item.issues_count}">
          <label>
            <span>{{item.issues_count}}</span>
          </label>
          open issues
        </div>

      </router-link>
    </ul>
  </div>

  <router-view v-else />  
</template>

<script>
import { mapState } from 'vuex';

import utils from '../../helpers/utils';

export default {
  name: 'ReposPage',
  data: () => ({
    list: [],
  }),
  computed: {
    ...mapState('auth', [
      'token',
    ]),
    extractList() {
      return this.list.map(({
        id,
        name,
        full_name,
        description,
        url,
        permissions,
        owner,
        open_issues_count,
      }) => ({
        id,
        name: permissions.admin ? name : full_name,
        description,
        url,
        issues_count: open_issues_count,
        issues_route: {
          owner: owner.login,
          name,
        },
      }));
    },
  },
  methods: {
    requestRepos() {
      utils.requestGithub({
        url: 'https://api.github.com/user/repos',
        params: {
          access_token: this.token,
          type: 'all',
          sort: 'pushed',
        },
      }).then((data) => {
        this.list = data;
      });
    },
  },
  created() {
    this.requestRepos();
  },
};
</script>