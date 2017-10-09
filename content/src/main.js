// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue';

import App from './App';

import store from './store';

import utils from './helpers/utils';

Vue.config.productionTip = false;

if (process.env.NODE_ENV === 'production') {
  const app = document.createElement('div');
  app.id = 'vGitssue';
  document.body.appendChild(app);
}

utils.loadExternalCss([
  'https://fonts.googleapis.com/css?family=Roboto',
  'https://code.ionicframework.com/ionicons/2.0.1/css/ionicons.min.css',
]);

/* eslint-disable no-new */
new Vue({
  el: '#vGitssue',
  store,
  template: '<App/>',
  components: { App },
});
