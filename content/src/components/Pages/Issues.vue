<template>
  <div class="issuesPage">
    New issue

    <ul class="issuesList">
      <li
        v-for="item in extractList"
        class="issuesList-issue"
        :key="item.id"
        @click="requestIssue(item.url)">

        <div class="issuesList-issue__info">
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
          class="issuesList-issue__comments"
          :class="{ disabled: !item.comments_count}">
          <i class="ion-ios-chatboxes-outline"/>
          {{item.comments_count}}
        </div>
        
      </li>
    </ul>
  </div>
</template>

<script>
import { mapState } from 'vuex';

import RelativeTime from '../Common/RelativeTime';

import utils from '../../helpers/utils';

export default {
  name: 'IssuesPage',
  props: {
    url: {
      type: String,
      required: true,
    },
  },
  data: () => ({
    list: [],
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
        url,
        labels,
        comments,
        user,
        created_at,
        closed_at,
      }) => ({
        id,
        title,
        url,
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
      utils.requestGithub({
        url: this.url,
        params: {
          access_token: this.token,
          filter: 'all',
        },
      }).then((data) => {
        this.list = data;
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
  },
};
</script>