export default {
  namespaced: true,
  state: {
    user: {},
  },
  mutations: {
    SIGN_IN(state, user) {
      state.user = user;
    },
  },
  actions: {
    signIn({ commit }, user) {
      commit('SIGN_IN', user);
    },
  },
};
