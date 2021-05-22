const gifFrames = require('gif-frames');
const axios = require('axios');
const gifInfo = require('gif-info');

class GifFrameServer {
  constructor(url) {
    this.url = url;
    this.type = 'gif';
  }

  async getInfos() {
    const response = await axios({
      url: this.url,
      method: 'GET',
      responseType: 'arraybuffer',
    });
    const infos = gifInfo(response.data);
    const duration = infos.durationChrome / 1000;
    return {
      height: infos.height,
      width: infos.width,
      duration,
      nFrames: infos.images.length,
      defaultDelay: duration / infos.images.length,
      fps: infos.images.length / duration,
    };
  }

  init() {
    const self = this;
    return new Promise((resolve) =>
      self.getInfos().then((sourceStats) => {
        self.sourceStats = sourceStats;
        gifFrames(
          {
            url: self.url,
            frames: 'all',
            outputType: 'canvas',
            cumulative: true,
          },
          (err, frameData) => {
            if (err) {
              console.log(err); // eslint-disable-line
            }
            let cumulativeTime = 0;
            const augmentedFrameData = frameData.map((frame) => {
              const { delay } = frame.frameInfo;
              cumulativeTime +=
                delay === 0 ? self.sourceStats.defaultDelay : delay / 100;
              const canvas = frame.getImage();
              return Object.assign(frame, {
                untilTime: cumulativeTime,
                canvas,
                canvasSource: canvas,
                jpegData: canvas.toDataURL('image/jpeg', 0.7),
              });
            });
            self.frameData = augmentedFrameData;
            resolve();
          },
        );
      }),
    );
  }

  getFrame(t, endBehaviour = 'loop') {
    if (t <= this.sourceStats.duration) {
      return this.frameData.find((frame) => frame.untilTime > t);
    }
    if (endBehaviour === 'loop') {
      return this.getFrame(t % this.sourceStats.duration);
    }
    if (endBehaviour === 'freeze') {
      return this.frameData[this.frameData.length - 1].imageDataUrl;
    }
    return null;
  }
}

export default GifFrameServer;
