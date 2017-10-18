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
    this.getScreenshot(true);
  }

  injectCanvas() {
    const canvas = document.createElement('canvas');
    canvas.id = this.canvasId;

    this.canvas = canvas;
  }

  setButtonDisplay(visible) {
    document.getElementById('vGitssue').style.display = visible ? 'block' : 'none';
  }

  getScreenshot(firstTime) {
    const elm = document.scrollingElement;
    const { scrollTop, clientWidth, scrollHeight } = elm;
    const clientHeight = window.innerHeight;

    if (firstTime) {
      elm.scrollTop = 0;

      this.canvas.width = clientWidth;
      this.canvas.height = scrollHeight;
    } else {
      elm.scrollTop = scrollTop + clientHeight;
    }

    setTimeout(() => {
      chrome.runtime.sendMessage(
        { message: 'capture' },
        (dataURL) => {
          const img = new Image();
          img.src = dataURL;
          img.onload = () => {
            this.canvas.getContext('2d').drawImage(img, 0, elm.scrollTop);

            if (elm.scrollHeight > elm.scrollTop + clientHeight && this.isFullScreen) {
              this.getScreenshot();
            } else {
              document.body.appendChild(this.canvas);
              this.initCrop();
              this.setButtonDisplay(true);
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
    this.uploadGDrive(this.cropper.getCroppedCanvas().toDataURL());
    this.destroyCrop();
    // cropper.getCroppedCanvas().toBlob(blob => console.log(blob));
  }

  destroyCrop() {
    this.cropper.destroy();
    document.body.removeChild(this.canvas);
  }

  uploadGDrive(dataURL) {
    chrome.runtime.sendMessage(
      { message: 'uploadGdrive', dataURL },
      (imgURL) => {
        console.log(imgURL);
      },
    );
  }
}
