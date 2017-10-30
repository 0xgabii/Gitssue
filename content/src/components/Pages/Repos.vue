<template>
  <div class="reposPage">
    <ul class="reposList">
      <li
        v-for="item in extractList"
        class="reposList-repo"
        :key="item.id"
        @click="requestIssues(item.url)">

        <div class="reposList-repo__info">
          <h3>{{item.name}}</h3>
          <p>{{item.description}}</p>
        </div>

        <div
          class="reposList-repo__issue"
          :class="{disabled: !item.issues_count}">
          <label>
            <span>{{item.issues_count}}</span>
          </label>
          open issues
        </div>

      </li>
    </ul>
  </div>
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
        open_issues_count,
      }) => ({
        id,
        name: permissions.admin ? name : full_name,
        description,
        url,
        issues_count: open_issues_count,
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
    requestIssues(url) {
      this.$emit('move-page', {
        component: 'issues',
        props: {
          url: `${url}/issues`,
        },
      });
    },
  },
  created() {
    this.requestRepos();
  },
};
</script>