const fs = require('fs-extra');

const identifier = process.env.NODE_ENV === 'production' ? 'prod' : 'dev';

fs.remove(`${identifier}/`).then(() => {
  fs.copy(`chrome/manifest.${identifier}.json`, `${identifier}/manifest.json`);
  fs.copy('chrome/content', `${identifier}/content`);
  fs.copy('chrome/background', `${identifier}/background`);

  if (identifier === 'prod') {
    fs.copy('dist/', 'prod/vue');
  } else {
    console.log('----------------------------------------------');
    console.log(`You're in developing mode`);
    console.log(`Load unpacked extensions from './dev' folder`);
    console.log('See - https://developer.chrome.com/extensions/getstarted#unpacked');
    console.log('----------------------------------------------');  
  }
});