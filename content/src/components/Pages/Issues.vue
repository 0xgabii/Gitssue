<template>
  <div class="issuesPage">
    New issue

    <loading-spinner v-if="loading" />

    <ul v-else class="issuesList">
      <router-link
        v-for="item in extractList"
        class="issue"
        tag="li"
        replace
        :key="item.id"
        :to="{ name: 'Issue', params: { issueId: item.number } }">

        <div class="issue-info">
          <span 
            v-for="label in item.labels" 
            :key="label.name"
            :style="{ backgroundColor: label.color }">
            {{label.name}}
          </span>

          <h3>
            {{item.title}}
          </h3>

          <p>
            {{item.state}}
            <relative-time :utc="item.time" />            
            by {{item.author}}
          </p>
        </div>

        <div
          class="issue-comments"
          :class="{'issue-comments--none': !item.comments_count}">
          <i class="ion-ios-chatboxes-outline"/>
          {{item.comments_count}}
        </div>
        
      </router-link>
    </ul>

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
  methods: {
    requestIssues() {
      const { owner, name } = this.$route.params;

      this.loading = true;

      utils.requestGithub({
        url: `https://api.github.com/repos/${owner}/${name}/issues`,
        params: {
          access_token: this.token,
          filter: 'all',
        },
      }).then((data) => {
        this.list = data;
        this.loading = false;
      });
    },
    requestIssue(url) {
      this.$emit('move-page', {
        component: 'issue',
        props: { url },
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