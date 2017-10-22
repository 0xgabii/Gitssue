function capture(port) {
  chrome.tabs.captureVisibleTab(
    null,
    { format: 'png' },
    function(dataURL) {
      port.postMessage(dataURL);
    }
  );
}

function saveToGoogleDrive(port, dataURL) {
  const chromeAuth = {
    interactive: true,
    scopes: ['https://www.googleapis.com/auth/drive.file'],
  };

  chrome.identity.getAuthToken(chromeAuth, (token) => {
    console.log(token, chrome.runtime);

    const mtpBoundary = '314159265358979323846';
    const partBoundary = `--${mtpBoundary}`;
    const lastBoundary = `--${mtpBoundary}--`;

    const [, mimeType, fileExt, srcBase64] = dataURL.match(/^data:(.+?\/(.+?));base64,(.+)/);

    const fileMeta = {
      title: `${document.title}.${fileExt}`,
      mimeType,
    };

    const requestBody = [
      partBoundary,
      'Content-Type: application/json; charset=UTF-8',
      '',
      JSON.stringify(fileMeta),
      partBoundary,
      `Content-Type: ${mimeType}`,
      'Content-Transfer-Encoding: base64',
      '',
      srcBase64,
      lastBoundary,
    ];

    const uploadRequest = new XMLHttpRequest;
    uploadRequest.open('post', 'https://www.googleapis.com/upload/drive/v2/files?uploadType=multipart');
    uploadRequest.setRequestHeader('Authorization', `OAuth ${token}`);
    uploadRequest.setRequestHeader('Content-Type', `multipart/mixed; boundary=${mtpBoundary}`);
    uploadRequest.send(requestBody.join('\r\n'));

    uploadRequest.onreadystatechange = () => {
      const { id, webContentLink } = JSON.parse(uploadRequest.response);

      const permissionsRequest = new XMLHttpRequest;
      permissionsRequest.open('post', `https://www.googleapis.com/drive/v2/files/${id}/permissions`);
      permissionsRequest.setRequestHeader('Authorization', `OAuth ${token}`);
      permissionsRequest.setRequestHeader('Content-Type', 'application/json');
      permissionsRequest.send(JSON.stringify({ role: 'reader', type: 'anyone' }));
      
      permissionsRequest.onreadystatechange = () => {
        port.postMessage(webContentLink);
      }
    }
  });
}

chrome.runtime.onConnect.addListener(function(port) {
  if (port.name === 'capture') {
    port.onMessage.addListener(() => capture(port));
  } else {
    port.onMessage.addListener(({ dataURL }) => saveToGoogleDrive(port, dataURL));
  }
});
