const capture = {
  wrapperId: 'wrapper_canvas',
  canvasId: 'display_capture',
  canvas: undefined,
  cropper: undefined,
  isFullCapture: false,

  init(isFullCapture) {
    this.isFullCapture = isFullCapture;

    this.createCanvas();
    this.setButtonDisplay(false);
    this.getCapturedScreen();
  },

  createCanvas() {
    const canvas = document.createElement('canvas');
    canvas.id = this.canvasId;
    this.canvas = canvas;
  },

  injectCanvas() {
    const div = document.createElement('div');
    div.id = this.wrapperId;
    div.appendChild(this.canvas);
    document.body.appendChild(div);
  },

  setButtonDisplay(visible) {
    document.getElementById('vGitssue').style.display = visible ? 'block' : 'none';
  },

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

          document.getElementById(this.wrapperId).style.top = this.isFullCapture ? 0 : `${elm.scrollTop}px`;
        }
      };
    });
  },

  initCrop() {
    this.cropper = new Cropper(this.canvas, {
      zoomable: false,
      autoCropArea: 0.3,
    });
  },

  crop() {
    const { left, top, width, height } = this.cropper.getCropBoxData();

    const canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;

    const ctx = canvas.getContext('2d');
    ctx.imageSmoothingEnabled = false;

    ctx.drawImage(this.canvas, left, top, width, height, 0, 0, width, height);

    this.uploadGDrive(canvas.toDataURL()).then((imgURL) => {
      message.send('capture', { imgURL });
    });
  },

  destroy() {
    this.cropper.destroy();
    document.body.removeChild(document.getElementById(this.wrapperId));
  },

  uploadGDrive(dataURL) {
    const port = chrome.runtime.connect({ name: 'upload' });

    port.postMessage({ dataURL });

    return new Promise((resolve) => {
      port.onMessage.addListener((imgURL) => {
        console.log(imgURL);
        resolve(imgURL);
      });
    });
  },
}
