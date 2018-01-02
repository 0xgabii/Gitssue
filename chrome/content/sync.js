const sync = {
  settings: {
    route: {},
    ui: {},
  },
  init() {
    chrome.storage.sync.get('settings', (results) => {
      const settings = results.settings;

      message.send('sync', Object.assign(this.settings, settings));
  
      // start observing token in storage
      this.observe();
    });
  },
  observe() {
    chrome.storage.onChanged.addListener((changes) => {
      if (!changes.settings) return;
      message.send('sync', changes.settings.newValue);
    });
  },
  save(settings) {
    chrome.storage.sync.get('settings', (results) => {
      chrome.storage.sync.set({ settings: Object.assign(Object.assign(this.settings, results.settings), settings) });
    });
  },
};
