import utils from '../../helpers/utils';

export default class Capture {
  constructor(type = 'visible') {
    if (type === 'visible') {
      this.isFullCapture = false;
    } else {
      this.isFullCapture = true;
    }
  }

  init() {
    utils.message('capture', { type: 'init', value: this.isFullCapture });
    window.addEventListener('message', this.handleMessage);
  }

  crop() {
    utils.message('capture', { type: 'crop' });
  }

  destroy() {
    utils.message('capture', { type: 'destroy' });
    window.removeEventListener('message', this.handleMessage);
  }

  handleMessage({ data: { port, msg } }) {
    if (port === 'capture') {
      prompt('Copy & paste this into markdown', `![](${msg.imgURL})`);
    }
  }
}
