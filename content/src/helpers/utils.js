import axios from 'axios';

export default {
  loadExternalCss(urls) {
    urls.forEach((url) => {
      const link = document.createElement('link');
      link.href = url;
      link.type = 'text/css';
      link.rel = 'stylesheet';
      document.getElementsByTagName('head')[0].appendChild(link);
    });
  },
  requestGithub({
    baseURL,
    url,
    method = 'get',
    headers = {
      Accept: 'application/vnd.github.v3+json',
    },
    params,
    data,
  }) {
    return new Promise((resolve, reject) => {
      axios.request({
        baseURL,
        url,
        method,
        headers,
        params,
        data,
      }).then(res => resolve(res.data))
      .catch(res => reject(res.error));
    });
  },
};
