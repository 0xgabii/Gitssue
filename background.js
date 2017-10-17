chrome.runtime.onMessage.addListener(
  function(request, sender, sendResponse) {

    chrome.tabs.captureVisibleTab(
      null,
      { format: 'png' },
      function(dataURL) {
        sendResponse(dataURL);
      }
    );

    return true; 
  }
);
