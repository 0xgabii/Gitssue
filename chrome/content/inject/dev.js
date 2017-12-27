function startInjection() {
  const iframe = document.createElement('iframe');
  iframe.id = 'vGitssue';
  iframe.src = 'http://localhost:3000';

  document.body.appendChild(iframe);
}

function startReceiveMessage() {
  window.addEventListener('message', ({ data }) => {
    if (message.process[data.port].constructor === Function) {
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
