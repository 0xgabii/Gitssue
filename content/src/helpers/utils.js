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
};
