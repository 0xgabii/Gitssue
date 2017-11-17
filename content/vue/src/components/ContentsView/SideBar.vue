<template>
  <div class="contentsView-sidebar">
    sidebar
  </div>
</template>

<script>
import axios from 'axios';
import { mapState } from 'vuex';

export default {
  name: 'ContentsViewSideBar',
  computed: {
    ...mapState('auth', [
      'token',
    ]),
  },
  methods: {
    request() {
      axios.post('https://api.github.com/graphql', {
        query: `{ 
          repository(owner: "gomonk3037", name: "Gitssue") { 
            issues(first: 5 orderBy: {field: CREATED_AT, direction: DESC}) {
              edges {
                node {
                  id,
                  title,
                  createdAt,
                }
              }
            }
          }
        }`,
      }, {
        headers: {
          Authorization: `bearer ${this.token}`,
        },
      }).then((res) => {
        console.log(res);
      });
    },
  },
  created() {
    this.request();
  },
};
</script>
