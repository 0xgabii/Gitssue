chrome.runtime.onMessage.addListener(
  function(request, sender, sendResponse) {
    
    if (request.message === 'capture') {
      chrome.tabs.captureVisibleTab(
        null,
        { format: 'png' },
        function(dataURL) {
          sendResponse(dataURL);
        }
      );

    } else if (request.message = 'uploadGdrive') {
      const chromeAuth = {
        interactive: true,
        scopes: ['https://www.googleapis.com/auth/drive.file'],
      };
  
      chrome.identity.getAuthToken(chromeAuth, (token) => {
        if (chrome.runtime.lastError) {
          alert(chrome.runtime.lastError.message);
          return;
        }
  
        const mtpBoundary = '314159265358979323846';
        const partBoundary = `--${mtpBoundary}`;
        const lastBoundary = `--${mtpBoundary}--`;
  
        const [, mimeType, fileExt, srcBase64] = request.dataURL.match(/^data:(.+?\/(.+?));base64,(.+)/);
  
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

        const ajax = new XMLHttpRequest;
        ajax.open('post', 'https://www.googleapis.com/upload/drive/v2/files?uploadType=multipart');
        ajax.setRequestHeader('Authorization', `OAuth ${token}`);
        ajax.setRequestHeader('Content-Type', `multipart/mixed; boundary=${mtpBoundary}`);
        ajax.send(requestBody.join('\r\n'));

        ajax.onreadystatechange = () => {
          if (ajax.status !== 200) return;

          sendResponse(ajax.response);
        }
      });
    }

    return true; 
  }
);
