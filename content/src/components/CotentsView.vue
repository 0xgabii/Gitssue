<template>
  <div class="contentsView">

    <div class="contentsView__header">
      <h3 @click="request2">Gitssue</h3>
      <div class="contentsView-controls">
        <i class="ion-ios-settings" @click="request" />
        <i class="ion-android-close" @click="changeUI({ category: 'extend', value: false })" />
      </div>
    </div>
    
    <div class="contentsView__body">
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

const requestGithub = ({
  url,
  method = 'get',
  params,
  data,
}) => axios.request({
  baseURL: 'https://api.github.com/',
  url,
  method,
  headers: {
    Accept: 'application/vnd.github.mercy-preview+json',
  },
  params,
  data,
});

export default {
  name: 'ContentsView',
  data: () => ({
    repos: undefined,
    issues: undefined,
  }),
  computed: {
    ...mapState('auth', [
      'user',
    ]),
  },
  methods: {
    ...mapActions('ui', [
      'changeUI',
    ]),
    request() {
      requestGithub({
        url: 'user/repos',
        params: {
          type: 'all',
          sort: 'pushed',
          access_token: this.user.access_token,
        },
      }).then(({ data }) => {
        this.repos = data;
      });
    },
    request1() {
      const { accessToken } = this.user;

      requestGithub({
        url: 'user/issues',
        params: {
          filter: 'all',
          state: 'open',
          sort: 'created',
          access_token: accessToken,
        },
      }).then(({ data }) => {
        this.issues = data;
      });
    },
    request2() {
      const { accessToken } = this.user;

      requestGithub({
        url: 'repos/PisonContent/musicspray-web/issues/108',
        params: {
          access_token: accessToken,
        },
      });
    },
  },
  created() {
    /*
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
    }); */
  },
  components: {
    RepoList,
    IssueList,
  },
};
</script>
