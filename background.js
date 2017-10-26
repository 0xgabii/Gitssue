function oauth(port) {
  const REDIRECT_URI = chrome.identity.getRedirectURL('oauth2');
  const CLIENT_ID = 'ecdb7ce9b19c87658e1b';
  const AUTH_URL = `https://github.com/login/oauth/authorize/?client_id=${CLIENT_ID}&redirect_uri=${REDIRECT_URI}&scope=repo`;

  const chromeAuth = {
    url: AUTH_URL,
    interactive: true,
  };

  chrome.identity.launchWebAuthFlow(chromeAuth, (uri) => {
    const code = new URL(uri).searchParams.get('code');
    const CLIENT_SECRET = 'e543b207ffc23254aa3b3a499d6b577447c8a21f';

    const xhr = new XMLHttpRequest;
    xhr.open('post', `https://github.com/login/oauth/access_token?code=${code}&client_id=${CLIENT_ID}&client_secret=${CLIENT_SECRET}`);
    xhr.onreadystatechange = function () {
      if(xhr.readyState === XMLHttpRequest.DONE && xhr.status === 200) {
        const access_token = xhr.responseText.split('access_token=')[1].split('&')[0];

        port.postMessage(access_token);
      }
    };
    xhr.send();    
  });
}

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
  } else if (port.name === 'auth') {
    port.onMessage.addListener(() => oauth(port));
  } else {
    port.onMessage.addListener(({ dataURL }) => saveToGoogleDrive(port, dataURL));    
  }
});
