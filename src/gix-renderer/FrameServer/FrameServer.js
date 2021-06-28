import LRU from './LRU';

class FrameServer {
  constructor() {
    this.projectionCanvas = document.createElement('canvas');
    this.projectionCanvasCtx = this.projectionCanvas.getContext('2d');
    this.lruCache = new LRU(10);
  }

  projectOnCanvas(source, params) {
    const { size, crop } = params;
    this.projectionCanvas.width = size.width;
    this.projectionCanvas.height = size.height;
    this.projectionCanvasCtx.drawImage(
      source,
      crop.left,
      crop.top,
      (source.width || source.videoWidth) - crop.right - crop.left,
      (source.height || source.videoHeight) - crop.top - crop.bottom,
      0,
      0,
      size.width,
      size.height,
    );
  }

  async getFrame(t, params) {
    const lruFrame = this.lruCache.getFromParams({ ...params, t });
    if (lruFrame) {
      return lruFrame;
    }
    while (this.isBusy) {
      // if (this.memory.frameJPEG) {
      //   console.log('reusing', this.isBusy);
      //   return this.memory.frameJPEG;
      // }
      // console.log('here');
      await new Promise((resolve) => setTimeout(resolve, 5)); // eslint-disable-line
    }
    this.isBusy = true;
    const frameJPEG = await this.getFrameJPEG(t, params);
    this.isBusy = false;
    this.lruCache.setFromParams({ ...params, t }, frameJPEG);
    return frameJPEG;
  }

  async getFrameJPEG(t, params) {
    const rawFrameData = await this.getFrameDataForTime(t);
    const shouldCrop = Object.values(params.crop).some((e) => e);
    const sameSizeAsFrame =
      params.size.width === rawFrameData.canvasSource.width &&
      params.size.height === rawFrameData.canvasSource.height;
    if (!shouldCrop && sameSizeAsFrame) {
      if (rawFrameData.jpegData) {
        return rawFrameData.jpegData;
      }
      if (rawFrameData.canvas) {
        return rawFrameData.canvas.toDataURL('image/jpeg', 0.7);
      }
    }
    this.projectOnCanvas(rawFrameData.canvasSource, params);
    return this.projectionCanvas.toDataURL('image/jpeg', 0.7);
  }
}

export default FrameServer;
