// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue';

import App from './App';

import store from './store';

import router from './router';

import install from './helpers/global';

Vue.config.productionTip = false;

install(Vue);

// force link from iframe to be opened in the parent window
const base = document.createElement('base');
base.target = '_blank';
document.head.appendChild(base);

if (process.env.NODE_ENV === 'develop') {
  const app = document.createElement('div');
  app.id = 'app';
  document.body.appendChild(app);
}

/* eslint-disable no-new */
new Vue({
  el: '#app',
  store,
  router,
  template: '<App/>',
  components: { App },
});
