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
    this.getScreenshot(true);
  }

  injectCanvas() {
    const canvas = document.getElementById(this.canvasId) || document.createElement('canvas');

    if (!document.getElementById(this.canvasId)) {
      canvas.id = this.canvasId;
    }

    this.canvas = canvas;
  }

  getScreenshot(firstTime) {
    const elm = document.scrollingElement;
    const { scrollTop, clientHeight, clientWidth, scrollHeight } = elm;

    if (firstTime) {
      elm.scrollTop = 0;

      this.canvas.width = clientWidth;
      this.canvas.height = scrollHeight;
    } else {
      elm.scrollTop = scrollTop + clientHeight;
    }

    setTimeout(() => {
      chrome.runtime.sendMessage(
        'startCapture',
        (dataURL) => {
          const img = new Image();
          img.src = dataURL;
          img.onload = () => {
            this.canvas.getContext('2d').drawImage(img, 0, elm.scrollTop);

            if (elm.scrollHeight > elm.scrollTop + elm.clientHeight && this.isFullScreen) {
              this.getScreenshot();
            } else {
              document.body.appendChild(this.canvas);
              this.initCrop();
            }
          };
        },
      );
    }, 150);
  }

  initCrop() {
    this.cropper = new Cropper(this.canvas, {
      zoomable: false,
    });
  }

  cropScreenshot() {
    console.log(this.cropper.getCroppedCanvas().toDataURL());
    this.cropper.destroy();
    // cropper.getCroppedCanvas().toBlob(blob => console.log(blob));
  }
}
