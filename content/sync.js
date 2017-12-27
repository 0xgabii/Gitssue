const sync = {
  load() {
    chrome.storage.sync.get('settings', (results) => {
      const settings = results.settings;
      const defaultSettings = {
        route: '/',
        ui: {},
      }

      message.send('sync', { 
        ...defaultSettings,
        ...settings,
      });

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
      chrome.storage.sync.set({ settings: {
        ...results.settings,
        ...settings,
      } });
    });
  },
};