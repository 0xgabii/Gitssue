chrome.webRequest.onHeadersReceived.addListener(details => ({
  responseHeaders: details.responseHeaders.filter(header => header.name.toLowerCase() !== 'content-security-policy'),
}), {
  urls: ['*://*/*'],
  types: ['main_frame', 'sub_frame'],
},
['blocking', 'responseHeaders']);