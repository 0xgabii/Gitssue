const port = chrome.runtime.connect({ name: 'auth' });
const storage = chrome.storage;

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
    authentication({ commit, dispatch }) {
      storage.sync.get('token', (results) => {
        const token = results.token;

        if (token) {
          commit('AUTH_SUCCEED', token);
        } else {
          commit('AUTH_FAILED');
        }
        console.log('get', token);
        // start observing token in storage
        dispatch('observeAuth');
      });
    },
    observeAuth({ commit }) {
      storage.onChanged.addListener((changes) => {
        const token = changes.token.newValue;

        if (token) {
          commit('AUTH_SUCCEED', token);
        } else {
          commit('AUTH_FAILED');
        }

        console.log('changes', changes);
      });
    },

    signIn() {
      port.postMessage();
      port.onMessage.addListener((access_token) => {
        storage.sync.set({ token: access_token });
      });
    },
    signOut() {
      storage.sync.set({ token: null });
    },
  },
};
