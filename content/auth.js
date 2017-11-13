const auth = {
  port: chrome.runtime.connect({ name: 'auth' }),

  init() {
    chrome.storage.sync.get('token', (results) => {
      const token = results.token;
      message.send('auth', { token });
      // start observing token in storage
      this.observe();
    });
  },
  observe() {
    chrome.storage.onChanged.addListener((changes) => {
      const token = changes.token.newValue;
      message.send('auth', { token });
    });
  },

  signIn() {
    this.port.postMessage();
    this.port.onMessage.addListener((access_token) => {
      chrome.storage.sync.set({ token: access_token });
    });
  },
  signOut() {
    chrome.storage.sync.set({ token: null });
  },
};
