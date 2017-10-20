import Cropper from 'cropperjs';
import 'cropperjs/dist/cropper.min.css';

export default class Screenshot {
  constructor(isFullScreen = true) {
    this.canvasId = 'display_screenshot';
    this.canvas = undefined;
    this.isFullScreen = isFullScreen;
    this.cropper = undefined;
  }

  init() {
    this.injectCanvas();
    this.setButtonDisplay(false);
    this.getScreenshot();
  }

  injectCanvas() {
    const canvas = document.createElement('canvas');
    canvas.id = this.canvasId;

    this.canvas = canvas;
  }

  setButtonDisplay(visible) {
    document.getElementById('vGitssue').style.display = visible ? 'block' : 'none';
  }

  getScreenshot() {
    const elm = document.scrollingElement;
    const clientHeight = window.innerHeight;

    const port = chrome.runtime.connect({ name: 'screenshot' });

    const scrollShot = (firstTime) => {
      const { scrollTop, clientWidth, scrollHeight } = elm;

      if (firstTime) {
        elm.scrollTop = 0;

        this.canvas.width = clientWidth;
        this.canvas.height = scrollHeight;
      } else {
        elm.scrollTop = scrollTop + clientHeight;
      }

      port.postMessage();
    };

    scrollShot(true);

    port.onMessage.addListener((dataURL) => {
      const img = new Image();
      img.src = dataURL;
      img.onload = () => {
        this.canvas.getContext('2d').drawImage(img, 0, elm.scrollTop);

        if (elm.scrollHeight > elm.scrollTop + clientHeight && this.isFullScreen) {
          scrollShot();
        } else {
          document.body.appendChild(this.canvas);
          this.initCrop();
          this.setButtonDisplay(true);
        }
      };
    });
  }

  initCrop() {
    this.cropper = new Cropper(this.canvas, {
      zoomable: false,
    });
  }

  cropScreenshot() {
    this.uploadGDrive(this.cropper.getCroppedCanvas().toDataURL());
    this.destroyCrop();
  }

  destroyCrop() {
    this.cropper.destroy();
    document.body.removeChild(this.canvas);
  }

  uploadGDrive(dataURL) {
    const port = chrome.runtime.connect({ name: 'upload' });

    port.postMessage({ dataURL });
    port.onMessage.addListener((imgURL) => {
      console.log(imgURL);
    });
  }
}
