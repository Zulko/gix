import async from 'async';
import LRU from './LRU';

class FrameServer {
  constructor() {
    this.projectionCanvas = document.createElement('canvas');
    this.projectionCanvasCtx = this.projectionCanvas.getContext('2d');
    this.lruCache = new LRU(10);
    const self = this;
    this.frameJPEGrequestsQueue = async.queue(async (params, callback) => {
      const frameJPEG = self.getFrameJPEG(params);
      callback(frameJPEG);
    }, 1);
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

  async getFrame(params) {
    const lruFrame = this.lruCache.getFromParams(params);

    if (lruFrame) {
      return lruFrame;
    }
    const self = this;
    const frameJPEG = await new Promise((resolve) => {
      self.frameJPEGrequestsQueue.push(params, resolve);
    });
    this.lruCache.setFromParams(params, frameJPEG);
    return frameJPEG;
  }

  async getFrameJPEG(params) {
    const rawFrameData = await this.getFrameDataForTime(params.t);
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
