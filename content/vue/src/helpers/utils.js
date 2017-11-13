import axios from 'axios';

export default {
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
