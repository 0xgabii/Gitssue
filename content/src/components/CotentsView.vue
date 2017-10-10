<template>
  <div class="contentsView">

    <div class="contentsView__header">
      <h3>Gitssue</h3>
      <div class="contentsView-controls">
        <i class="ion-ios-settings" />
        <i class="ion-android-close" @click="changeUI({ category: 'extend', value: false })" />
      </div>
    </div>
    
    <div class="contentsView__body">

      <template v-if="auth">
        successfully sign in
        <button @click="signOut">Sign out</button>
      </template>

      <div v-else>
        you have to login github for viewing repos & issue
        <button @click="signIn">Sign In</button>
      </div>

      <button @click="requestRepos">requestRepos</button>
      <button @click="requestIssues">requestIssues</button>

      <repo-list :data="repos" />
      <issue-list :data="issues" />
    </div>

  </div>
</template>

<script>
import axios from 'axios';

import { mapState, mapActions } from 'vuex';

import firebase from '../helpers/firebase';

import RepoList from './Repos';
import IssueList from './Issues';

const provider = new firebase.auth.GithubAuthProvider();
provider.addScope('repo');

export default {
  name: 'ContentsView',
  data: () => ({
    repos: undefined,
    issues: undefined,
  }),
  computed: {
    ...mapState('auth', [
      'auth',
      'user',
    ]),
  },
  methods: {
    ...mapActions('ui', [
      'changeUI',
    ]),
    requestGithub({
      url,
      method = 'get',
      params,
      data,
    }) {
      axios.request({
        baseURL: 'https://api.github.com/',
        url,
        method,
        headers: {
          Accept: 'application/vnd.github.v3+json',
        },
        params: {
          ...params,
          access_token: this.user.access_token,
        },
        data,
      });
    },
    requestRepos() {
      this.requestGithub({
        url: 'user/repos',
        params: {
          type: 'all',
          sort: 'pushed',
        },
      }).then(({ data }) => {
        this.repos = data;
      });
    },
    requestIssues() {
      this.requestGithub({
        url: 'user/issues',
        params: {
        },
      }).then(({ data }) => {
        this.issues = data;
      });
    },

    signIn() {
      firebase.auth().signInWithPopup(provider).then(({ additionalUserInfo, credential, user }) => {
        const { avatar_url, html_url, login, name } = additionalUserInfo.profile;

        firebase.database().ref(`users/${user.uid}`).set({
          name,
          nickname: login,
          picture: avatar_url,
          url: html_url,
          access_token: credential.accessToken,
        });
      }).catch((error) => {
        console.log(error);
      });
    },
    signOut() {
      firebase.auth().signOut();
    },
  },
  components: {
    RepoList,
    IssueList,
  },
};
</script>
