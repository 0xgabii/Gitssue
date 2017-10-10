import firebase from '../../helpers/firebase';

const database = firebase.database();

export default {
  namespaced: true,
  state: {
    auth: false,

    user: {},
  },
  mutations: {
    SIGN_IN(state, user) {
      state.auth = true;
      state.user = user;
    },
    SIGN_OUT(state) {
      state.auth = false;
      state.user = {};
    },
  },
  actions: {
    authentication({ commit }, user) {
      if (user) {
        database.ref(`users/${user.uid}`).once('value').then((snapshot) => {
          commit('SIGN_IN', snapshot.val());
        });
      } else {
        commit('SIGN_OUT');
      }
    },
  },
};
