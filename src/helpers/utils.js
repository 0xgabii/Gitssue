import axios from 'axios';

export default {
  requestRest({
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
        baseURL: 'https://api.github.com',
        url,
        method,
        headers,
        params,
        data,
      }).then(res => resolve(res.data))
      .catch(res => reject(res.error));
    });
  },
  request({ token, query }) {
    return new Promise((resolve) => {
      axios.post('https://api.github.com/graphql', {
        query,
      }, {
        headers: {
          Authorization: `bearer ${token}`,
        },
      }).then((res) => {
        resolve(res.data.data);
      });
    });
  },
  message(port, msg) {
    window.parent.postMessage({ port, msg }, '*');
  },
};
