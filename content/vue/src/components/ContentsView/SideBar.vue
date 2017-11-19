<template>
  <div class="contentsView-sidebar">
    
    <router-link 
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
      :key="repo.id"
      to="lol">
      <span class="repo__name">
        {{repo.name}}
      </span>
    </router-link>
  
    <div class="circle repo repo--none">
      <i class="ion-ios-plus-empty" />
    </div>

  </div>
</template>

<script>
import axios from 'axios';
import { mapState } from 'vuex';

export default {
  name: 'ContentsViewSideBar',
  data: () => ({
    user: {
      name: '',
      avatarUrl: '',
    },

    repos: [],
  }),
  computed: {
    ...mapState('auth', [
      'token',
    ]),
  },
  methods: {
    request(query) {
      return new Promise((resolve) => {
        axios.post('https://api.github.com/graphql', {
          query,
        }, {
          headers: {
            Authorization: `bearer ${this.token}`,
          },
        }).then((res) => {
          resolve(res.data.data);
        });
      });
    },
    getUser() {
      this.request(`{
        viewer {
          name,
          avatarUrl
        }
      }`).then(({ viewer }) => {
        this.user = {
          ...this.user,
          ...viewer,
        };
      });
    },
    getRepos() {
      this.request(`{ 
        viewer {
          repositories(first: 5) {
            edges {
              node {
                id,
                name
              }
            }
          }
        }
      }`).then(({ viewer }) => {
        this.repos = viewer.repositories.edges.map(({ node }) => ({
          id: node.id,
          name: node.name.slice(0, 4),
        }));
      });
    },
  },
  created() {
    this.getUser();
    this.getRepos();
  },
};
</script>
