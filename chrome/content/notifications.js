const notifications = {
  port: chrome.runtime.connect({ name: 'notifications' }),

  init() {
    chrome.storage.local.get('notifications', (results) => {
      message.send('notifications', results.notifications || []);
      // start observing
      this.observe();
      this.port.onMessage.addListener(this.handleMessage);
    });
  },
  observe() {
    chrome.storage.onChanged.addListener((changes) => {
      if (!changes.notifications) return;
      message.send('notifications', changes.notifications.newValue);
    });
  },
  saveNotis(notis) {
    chrome.storage.local.get('notifications', (results) => {
      const list = results.notifications || [];
      const newNotis = notis.filter(noti => !list.find(v => v.id === noti.id));

      if (newNotis.length) {
        this.port.postMessage(newNotis);
        chrome.storage.local.set({ notifications: list.concat(newNotis) });
      }
    });
  },

  handleMessage(notification) {
    const route = notification.route;
    sync.save({ route, ui: { extend: true } });
  },
};
