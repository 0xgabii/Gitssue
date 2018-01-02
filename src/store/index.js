import Vue from 'vue';
import Vuex from 'vuex';

import ui from './modules/ui';
import resource from './modules/resource';

Vue.use(Vuex);

export default new Vuex.Store({
  modules: {
    ui,
    resource,
  },
});
