import utils from '../../helpers/utils';

export default {
  namespaced: true,
  state: {
    auth: false,

    token: undefined,
  },
  mutations: {
    AUTH_SUCCEED(state, token) {
      state.auth = true;
      state.token = token;
    },
    AUTH_FAILED(state) {
      state.auth = false;
      state.token = undefined;
    },
  },
  actions: {
    authentication({ dispatch }) {
      utils.message('auth', { type: 'init' });
      dispatch('observeAuth');
    },
    observeAuth({ commit }) {
      window.addEventListener('message', ({ data: { port, msg } }) => {
        if (port === 'auth') {
          if (msg.token) {
            commit('AUTH_SUCCEED', msg.token);
          } else {
            commit('AUTH_FAILED');
          }
        }
      });
    },

    signIn() {
      utils.message('auth', { type: 'signIn' });
    },
    signOut() {
      utils.message('auth', { type: 'signOut' });
    },
  },
};
