const iframe = document.createElement('iframe');
iframe.id = 'vGitssue';
iframe.src = 'http://localhost:3000';
iframe.onload = function() {
  window.addEventListener('message', ({ data }) => {
    message.process[data.port](data.msg);
  });
}
document.body.appendChild(iframe);