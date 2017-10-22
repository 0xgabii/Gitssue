import Cropper from 'cropperjs';
import 'cropperjs/dist/cropper.min.css';

export default class Capture {
  constructor(type = 'visible') {
    this.canvasId = 'display_capture';
    this.canvas = undefined;
    this.cropper = undefined;

    if (type === 'visible') {
      this.isFullCapture = false;
    } else {
      this.isFullCapture = true;
    }
  }

  init() {
    this.createCanvas();
    this.setButtonDisplay(false);
    this.getCapturedScreen();
  }

  createCanvas() {
    const canvas = document.createElement('canvas');
    canvas.id = this.canvasId;

    this.canvas = canvas;
  }

  setButtonDisplay(visible) {
    document.getElementById('vGitssue').style.display = visible ? 'block' : 'none';
  }

  getCapturedScreen() {
    const elm = document.scrollingElement;
    const clientHeight = window.innerHeight;

    const port = chrome.runtime.connect({ name: 'capture' });

    const captureScreen = (firstTime) => {
      const { scrollTop, clientWidth, scrollHeight } = elm;

      if (firstTime) {
        if (this.isFullCapture) {
          elm.scrollTop = 0;
        }

        this.canvas.width = clientWidth;
        this.canvas.height = scrollHeight;
      } else {
        elm.scrollTop = scrollTop + clientHeight;
      }

      port.postMessage();
    };

    captureScreen(true);

    port.onMessage.addListener((dataURL) => {
      const img = new Image();
      img.src = dataURL;
      img.onload = () => {
        this.canvas.getContext('2d').drawImage(img, 0, elm.scrollTop);

        if (elm.scrollHeight > elm.scrollTop + clientHeight && this.isFullCapture) {
          captureScreen();
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

  crop() {
    const dataURL = this.cropper.getCroppedCanvas().toDataURL();

    return this.uploadGDrive(dataURL);
  }

  destroy() {
    this.cropper.destroy();
    document.body.removeChild(this.canvas);
  }

  uploadGDrive(dataURL) {
    const port = chrome.runtime.connect({ name: 'upload' });

    port.postMessage({ dataURL });

    return new Promise((resolve) => {
      port.onMessage.addListener((imgURL) => {
        resolve(imgURL);
      });
    });
  }
}
