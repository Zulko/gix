import gifFrames from 'gif-frames';
import axios from 'axios';
import gifInfo from 'gif-info';
import FrameServer from './FrameServer';

class GifFrameServer extends FrameServer {
  constructor(url) {
    super();
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
    return new Promise((resolve) => {
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
              console.error(err); // eslint-disable-line
            }
            let cumulativeTime = 0;
            const augmentedFrameData = frameData.map((frame) => {
              const { delay } = frame.frameInfo;
              cumulativeTime +=
                delay === 0 ? self.sourceStats.defaultDelay : delay / 100;
              const canvas = frame.getImage();
              const context = canvas.getContext('2d');
              const canvasHasAlpha = FrameServer.canvasHasAlpha(
                context,
                canvas,
              );
              if (canvasHasAlpha) {
                this.hasTransparency = true;
              }
              return Object.assign(frame, {
                untilTime: cumulativeTime,
                canvas,
                canvasSource: canvas,
                jpegData: this.canvasToPictureData({
                  canvas,
                  canvasHasAlpha,
                }),
              });
            });
            self.frameData = augmentedFrameData;
            resolve();
          },
        );
      });
    });
  }

  getFrameDataForTime(t) {
    const frame = this.frameData.find((f) => f.untilTime >= t);
    return frame || this.frameData[this.frameData.length - 1];
  }
}

export default GifFrameServer;
