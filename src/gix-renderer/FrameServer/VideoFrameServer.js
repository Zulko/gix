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
    this.isBusy = false;
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

  async getFrameDataForTime(t) {
    await this.setVideoTimeAndWait(t);
    return { canvasSource: this.video };
  }

  async setVideoTimeAndWait(t) {
    if (this.video.currentTime === t) {
      return null;
    }
    const self = this;
    // eslint-disable-next-line no-unused-vars
    return new Promise((resolve, reject) => {
      self.video.onerror = reject;
      self.video.onseeked = (evt) => {
        self.video.onseeked = null;
        resolve(evt);
      };
      self.video.currentTime = t.toFixed(2);
    });
  }
}

export default VideoFrameServer;
