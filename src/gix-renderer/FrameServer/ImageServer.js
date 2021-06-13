class ImageServer {
  constructor(url) {
    this.url = url;
    this.type = 'image';
    this.canvas = null;
  }

  init() {
    const self = this;
    return new Promise((resolve) => {
      self.baseImage = new Image();
      self.baseImage.crossOrigin = '';
      // self.canvas.crossorigin = 'anonymous'
      self.baseImage.onload = () => {
        const stats = {
          width: self.baseImage.width,
          height: self.baseImage.height,
        };
        self.sourceStats = stats;
        self.canvas = document.createElement('canvas');
        self.canvas.crossorigin = 'anonymous';
        self.baseImage.crossOrigin = 'anonymous';
        self.canvas.width = stats.width;
        self.canvas.height = stats.height;
        const context = self.canvas.getContext('2d');
        context.drawImage(self.baseImage, 0, 0);
        self.jpegData = self.canvas.toDataURL('image/jpeg', 0.7);
        resolve();
      };
      self.baseImage.src = self.url;
    });
  }

  async getInfos() {
    if (!this.baseImage) {
      await this.init();
    }
    return {
      height: this.canvas.height,
      width: this.canvas.width,
      duration: 5,
      defaultDelay: 0.1,
      fps: 10,
    };
  }

  getFrame() {
    return {
      canvas: this.canvas,
      canvasSource: this.canvas,
      jpegData: this.jpegData,
    };
  }
}

export default ImageServer;
