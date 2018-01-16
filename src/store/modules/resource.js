import utils from '../../helpers/utils';

/*
  Communicate with content.js outside iframe
*/

export default {
  namespaced: true,
  state: {
    auth: undefined,
    repos: [],
    notifications: [],
    sync: {},
  },
  mutations: {
    GET_RESOURCE_SUCCEED(state, { category, value }) {
      state[category] = value;
    },
  },
  actions: {
    init({ dispatch, state }) {
      Object.keys(state).forEach((key) => {
        utils.message(key, { type: 'init' });
      });
      dispatch('observe');
    },
    observe({ commit }) {
      window.addEventListener('message', ({ data: { port, msg } }) => {
        commit('GET_RESOURCE_SUCCEED', { category: port, value: msg });
      });
    },
  },
};
