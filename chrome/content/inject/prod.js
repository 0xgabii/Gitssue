function startInjection() {
  const iframe = document.createElement('iframe');
  iframe.id = 'vGitssue';

  const appendScript = (name) => {
    const script = document.createElement('script');
    script.src = chrome.extension.getURL(`vue/static/js/${name}.js`);
    iframe.contentWindow.document.body.appendChild(script);

    return new Promise((res) => {
      script.onload = function() {
        res();
      }
    });
  };

  const appendStyle = (name) => {
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = chrome.extension.getURL(`vue/static/css/${name}.css`);
    iframe.contentWindow.document.body.appendChild(link);

    return new Promise((res) => {
      link.onload = function() {
        res();
      }
    });
  };

  iframe.onload = function() {
    appendScript('manifest')
      .then(() => appendScript('vendor'))
      .then(() => appendScript('app'))
      .then(() => appendStyle('app'));
  }

  document.body.appendChild(iframe);  
}

function startReceiveMessage() {
  window.addEventListener('message', ({ data }) => {
    if (typeof message.process[data.port] === "function") {
      message.process[data.port](data.msg);
    }
  });
}

const interval = setInterval(() => {
  if (Object.keys(message.process).length) {
    startInjection();
    startReceiveMessage();
    clearInterval(interval);
  }
}, 500);
