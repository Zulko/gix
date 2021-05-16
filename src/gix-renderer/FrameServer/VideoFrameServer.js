import FrameServer from './FrameServer';

class VideoFrameServer extends FrameServer {
  constructor(url, resolvedUrl) {
    super();
    this.url = url;
    this.resolvedUrl = resolvedUrl || url;
    this.type = 'video';
    this.video = document.createElement('video');
    this.video.muted = true;
    this.video.crossOrigin = 'Anonymous';
  }

  canPlayListener(canPlayEvent) {
    this.promiseResolver(canPlayEvent);
  }

  async getInfos() {
    if (!this.sourceStats) {
      await this.init();
    }
    return this.sourceStats;
  }

  init() {
    const self = this;
    return new Promise((resolve, reject) => {
      self.video.oncanplay = (canPlayEvent) => {
        self.sourceStats = {
          height: canPlayEvent.target.videoHeight,
          width: canPlayEvent.target.videoWidth,
          duration: canPlayEvent.target.duration,
          fps: canPlayEvent.target.fps,
        };
        self.canvas = document.createElement('canvas');
        self.canvas.width = self.sourceStats.width;
        self.canvas.height = self.sourceStats.height;
        self.canvasCtx = self.canvas.getContext('2d');
        resolve(canPlayEvent);
        self.video.oncanplay = null;
      };
      self.video.onerror = (e) => {
        reject(e);
      };
      self.video.setAttribute('src', self.resolvedUrl);
    });
  }

  async getFrame(t, params) {
    // await this.drawFrameOnCanvas(t, this.canvasCtx);
    if (t <= this.sourceStats.duration) {
      await this.setVideoTimeAndWait(t);
      return {
        canvasSource: this.video,
      };
    }
    if (params.endBehaviour === 'loop') {
      return this.getFrame(t % this.sourceStats.duration);
    }
    if (params.endBehaviour === 'freeze') {
      return this.frameData[this.frameData.length - 1].imageDataUrl;
    }
    return null;
  }

  setVideoTimeAndWait(t) {
    const self = this;
    // eslint-disable-next-line no-unused-vars
    return new Promise((resolve, reject) => {
      self.video.onerror = reject;
      self.video.onseeked = (evt) => {
        console.log(evt);
        resolve(evt);
        self.video.onseeked = null;
      };
      self.video.currentTime = t.toFixed(2);
    });
  }
}

export default VideoFrameServer;
