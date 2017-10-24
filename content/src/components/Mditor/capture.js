import Cropper from 'cropperjs';
import 'cropperjs/dist/cropper.min.css';

export default class Capture {
  constructor(type = 'visible') {
    this.wrapperId = 'wrapper_canvas';
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

  injectCanvas() {
    const div = document.createElement('div');
    div.id = this.wrapperId;
    div.appendChild(this.canvas);
    document.body.appendChild(div);
  }

  destroyCanvas() {
    document.body.removeChild(document.getElementById(this.wrapperId));
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

          this.canvas.height = scrollHeight;
        } else {
          this.canvas.height = clientHeight;
        }

        this.canvas.width = clientWidth;
      } else {
        elm.scrollTop = scrollTop + clientHeight;
      }

      setTimeout(() => {
        port.postMessage();
      }, 150);
    };

    captureScreen(true);

    port.onMessage.addListener((dataURL) => {
      const img = new Image();
      img.src = dataURL;
      img.onload = () => {
        this.canvas.getContext('2d').drawImage(img, 0, this.isFullCapture ? elm.scrollTop : 0);

        if (elm.scrollHeight > elm.scrollTop + clientHeight && this.isFullCapture) {
          captureScreen();
        } else {
          this.injectCanvas();
          this.initCrop();
          this.setButtonDisplay(true);

          if (this.isFullCapture) {
            elm.scrollTop = 0;
          }
          // eslint-disable-next-line
          document.getElementById(this.wrapperId).style.top = this.isFullCapture ? 0 : `${elm.scrollTop}px`;
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
    const dataURL = this.cropper.getCroppedCanvas({
      imageSmoothingEnabled: false,
    }).toDataURL();

    return this.uploadGDrive(dataURL);

    /*
    const { left, top, width, height } = this.cropper.getCropBoxData();

    const canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;

    const ctx = canvas.getContext('2d');
    ctx.imageSmoothingEnabled = false;

    ctx.drawImage(
      this.canvas,
      left, top,
      width, height,
      0, 0,
      width, height,
    );

    document.body.appendChild(canvas);
    */
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
