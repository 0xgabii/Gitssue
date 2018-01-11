const fs = require('fs');
const axios = require('axios');
const querystring = require('querystring');

const extensionID = 'iagekpbdeollpioaefgfkjfdogeofjcf';
const client_id = '868497383059-hvrou8l7bpe119aqb50j6oq153c0003t.apps.googleusercontent.com';
const client_secret = process.env.CLIENT_SECRET;
const refresh_token = process.env.REFRESH_TOKEN;

const authURI = 'https://accounts.google.com/o/oauth2/token';
const uploadURI = `https://www.googleapis.com/upload/chromewebstore/v1.1/items/${extensionID}`;
const publishURI = `https://www.googleapis.com/chromewebstore/v1.1/items/${extensionID}/publish`;

fs.readdir('releases', (err, files) => {
  if (!files.length) {
    console.log('There are no release zip to deploy');
    return;
  }
  const lastest_release = files.sort((a, b) => a < b)[0];
  
  const getAccessToken = () => new Promise((resolve, reject) => axios.post(authURI, querystring.stringify({
    client_id,
    client_secret,
    refresh_token,
    grant_type: 'refresh_token',
    redirect_uri: 'urn:ietf:wg:oauth:2.0:oob',
  }))
  .then(res => resolve(res.data.access_token))
  .catch(err => reject(err)));

  const deployExtension = token => new Promise((resolve, reject) => axios.put(uploadURI, fs.readFileSync(`releases/${lastest_release}`), {
    headers: {
      Authorization: `Bearer ${token}`,
      'x-goog-api-version': 2,
    }
  })
  .then(res => resolve(token))
  .catch(err => reject(err)));

  const publishExtension = token => new Promise((resolve, reject) => axios.post(publishURI, undefined, {
    headers: {
      Authorization: `Bearer ${token}`,
      'x-goog-api-version': 2,
    }
  })
  .then(res => resolve(res))
  .catch(err => reject(err)));

  // start deploying
  getAccessToken()
    .then(deployExtension)
    .then(publishExtension)
    .then(() => console.log(`Complete deploy ${lastest_release}`))
    .catch(err => console.log(err));
});
