<template>
  <div class="profile">
      <img 
        class="profile__avatar"
        :src="user.avatarUrl"
      />
      <h1 class="profile__name">{{user.name}}</h1>
      <h3 class="profile__nickName">{{user.login}}</h3>
      <button 
        class="profile__signOut"
        @click="signOut">
        Sign out
      </button>
  </div>
</template>

<script>
import { mapState } from 'vuex';

import utils from '../../helpers/utils';

export default {
  name: 'Profile',
  data: () => ({
    user: {
      name: '',
      login: '',
      avatarUrl: '',
    },
  }),
  computed: {
    ...mapState('resource', [
      'auth',
    ]),
  },
  methods: {
    signOut() {
      utils.message('auth', { type: 'signOut' });
    },

    request() {
      utils.request({
        token: this.auth,
        query: `{
          viewer {
            name
            login
            avatarUrl
          }
        }`,
      }).then(({ viewer }) => {
        this.user = viewer;
      });
    },
  },
  created() {
    this.request();
  },
};
</script>