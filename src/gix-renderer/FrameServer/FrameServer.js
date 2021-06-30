import async from 'async';
import LRU from './LRU';

class FrameServer {
  constructor() {
    this.projectionCanvas = document.createElement('canvas');
    this.projectionCanvasCtx = this.projectionCanvas.getContext('2d');
    this.hasTransparency = false;
    this.lruCache = new LRU(10);
    const self = this;
    this.frameBase64DatarequestsQueue = async.queue(
      async (params, callback) => {
        const frameBase64Data = await self.getFrameBase64Data(params);
        callback(frameBase64Data);
      },
      1,
    );
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
    const frameBase64Data = await new Promise((resolve) => {
      self.frameBase64DatarequestsQueue.push(params, resolve);
    });
    this.lruCache.setFromParams(params, frameBase64Data);
    return frameBase64Data;
  }

  async getFrameBase64Data(params) {
    const rawFrameData = await this.getFrameDataForTime(params.t);
    const shouldCrop = Object.values(params.crop).some((e) => e);
    const sameSizeAsFrame =
      params.size.width === rawFrameData.canvasSource.width &&
      params.size.height === rawFrameData.canvasSource.height;
    if (!shouldCrop && sameSizeAsFrame) {
      if (rawFrameData.imageBase64Data) {
        return rawFrameData.imageBase64Data;
      }
      if (rawFrameData.canvas) {
        return this.canvasToPictureData({
          context: rawFrameData.canvas.getContext('2d'),
          canvas: rawFrameData.canvas,
        });
      }
    }
    this.projectOnCanvas(rawFrameData.canvasSource, params);
    return this.canvasToPictureData({
      context: this.projectionCanvasCtx,
      canvas: this.projectionCanvas,
    });
  }

  static canvasHasAlpha(context, canvas) {
    const { data } = context.getImageData(0, 0, canvas.width, canvas.height);
    for (let i = 3, n = data.length; i < n; i += 4) {
      if (data[i] < 255) {
        return true;
      }
    }
    return false;
  }

  canvasToPictureData({ canvas, context, canvasHasAlpha }) {
    if (canvasHasAlpha !== undefined) {
      return canvasHasAlpha
        ? canvas.toDataURL('image/png')
        : canvas.toDataURL('image/jpeg', 0.7);
    }
    if (!this.hasTransparency) {
      return canvas.toDataURL('image/jpeg', 0.7);
    }
    return FrameServer.canvasHasAlpha(context, canvas)
      ? canvas.toDataURL('image/png')
      : canvas.toDataURL('image/jpeg', 0.7);
  }
}

export default FrameServer;
