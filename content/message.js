const message = {
  send(port, msg) {
    document.getElementById('vGitssue').contentWindow.postMessage({ port, msg }, '*');
  },

  process: {
    auth: ({ type }) => auth[type](),
    ui: ({ type, value }) => ui[type](value),
    capture: ({ type, value }) => capture[type](value),
  },
};