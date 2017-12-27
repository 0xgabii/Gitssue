const repos = {
  port: chrome.runtime.connect({ name: 'repos' }),

  init() {
    chrome.storage.sync.get('list', (results) => {
      message.send('repos', results.list || []);
      // start observing token in storage
      this.observe();
    });
  },
  observe() {
    chrome.storage.onChanged.addListener((changes) => {
      if (!changes.list) return;
      message.send('repos', changes.list.newValue);
    });
  },
  addRepo(repos) {
    chrome.storage.sync.get('list', (results) => {
      const list = results.list || [];
      chrome.storage.sync.set({ list: [...list, ...repos] });
    });
  },
  removeRepo(index) {
    chrome.storage.sync.get('list', (results) => {
      const list = results.list || [];
      chrome.storage.sync.set({ list: list.filter((repo, rIdx) => index !== rIdx) });
    });
  },
};