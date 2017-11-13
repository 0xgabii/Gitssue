<template>
  <div>
  
    select repo
    <select v-model="select.v">
      <option
        v-for="option in select.options"
        :key="option.id"
        :value="option.url">
        {{option.name}}
      </option>
    </select>

    <mditor 
      submitText="Submit new issue"
      @submit="requestNewIssue"
    />
  
  </div>  
</template>

<script>
import { mapState } from 'vuex';

import utils from '../../helpers/utils';

import Mditor from '../Mditor';

export default {
  name: 'NewIssuePage',
  data: () => ({
    select: {
      v: undefined,
      options: [],
    },
  }),
  computed: {
    ...mapState('auth', [
      'token',
    ]),
  },
  methods: {
    requestNewIssue({ title, contents }) {
      if (!title) {
        alert('Title required!');
        return;
      }

      utils.requestGithub({
        url: `${this.select.v}/issues`,
        method: 'post',
        params: {
          access_token: this.token,
        },
        data: {
          title,
          body: contents,
        },
      });
    },
    requestRepos() {
      utils.requestGithub({
        url: 'https://api.github.com/user/repos',
        params: {
          access_token: this.token,
          type: 'all',
          sort: 'pushed',
        },
      }).then((data) => {
        this.select.options = data.map(({
          id,
          name,
          full_name,
          url,
          permissions,
        }) => ({
          id,
          name: permissions.admin ? name : full_name,
          url,
        }));
      });
    },
  },
  created() {
    this.requestRepos();
  },
  components: {
    Mditor,
  },
};
</script>
