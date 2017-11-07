const iframe = document.createElement('iframe');
iframe.id = 'vGitssue';
iframe.onload = function() {
  const xhr = new XMLHttpRequest();
  xhr.open('GET', 'http://localhost:3000/app.js', true);
  xhr.onreadystatechange = function() {
    if (xhr.readyState == 4) {
      iframe.contentWindow.eval(xhr.responseText);
    }
  }
  xhr.send();
}
document.body.appendChild(iframe);