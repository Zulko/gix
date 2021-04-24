class ImageServer {
  constructor(url) {
    this.url = url;
    this.type = 'image';
  }

  init() {
    const self = this;
    return new Promise((resolve) => {
      self.base_image = new Image();
      self.base_image.crossOrigin = '';
      // self.canvas.crossorigin = 'anonymous'
      self.base_image.onload = () => {
        const stats = {
          width: self.base_image.width,
          height: self.base_image.height,
        };
        self.sourceStats = stats;
        self.canvas = document.createElement('canvas');
        self.canvas.crossorigin = 'anonymous';
        self.base_image.crossOrigin = 'anonymous';
        self.canvas.width = stats.width;
        self.canvas.height = stats.height;
        const context = self.canvas.getContext('2d');
        context.drawImage(self.base_image, 0, 0);
        self.jpegData = self.canvas.toDataURL('image/jpeg', 0.7);
        resolve();
      };
      self.base_image.src = self.url;
    });
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
