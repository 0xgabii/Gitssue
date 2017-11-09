const iframe = document.createElement('iframe');
iframe.id = 'vGitssue';
iframe.onload = function() {
  const frameWin = iframe.contentWindow;

  // force link from iframe to be opened in the parent window
  const base = document.createElement('base');
  base.target = '_blank';
  frameWin.document.head.appendChild(base);
  // hot reload for developing
  const xhr = new XMLHttpRequest();
  xhr.open('GET', 'http://localhost:3000/app.js', true);
  xhr.onreadystatechange = function() {
    if (xhr.readyState == 4) {
      frameWin.eval(xhr.responseText);
    }
  }
  xhr.send();
}
document.body.appendChild(iframe);