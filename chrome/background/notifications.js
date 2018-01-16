let notiOpt = {
  list: [],
  port: null,
};

chrome.notifications.onClicked.addListener((id) => {
  notiOpt.port.postMessage(notiOpt.list.find(noti => noti.id === id));
});

function notifications(port, notis) {
  notis.forEach((noti) => {
    chrome.notifications.create(noti.id, {
      type: 'basic',
      title: noti.title,
      message: noti.message,
      contextMessage: noti.contextMessage,
      iconUrl: noti.iconUrl,
    });
  });

  notiOpt = {
    list: notis,
    port,
  };
}
