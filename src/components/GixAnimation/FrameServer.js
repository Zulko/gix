var gifFrames = require('gif-frames')

export class VideoFrameServer {
  constructor (url) {
    this.url = url
    this.video = document.createElement('video')
    this.video.muted = true
    this.video.crossOrigin = 'Anonymous'
  }
  canPlayListener (self, canPlayEvent) {
    self.promiseResolver(canPlayEvent)
  }
  init () {
    var self = this
    return new Promise(function (resolve, reject) {
      self.video.oncanplay = function (canPlayEvent) {
        self.sourceStats = {
          height: canPlayEvent.target.videoHeight,
          width: canPlayEvent.target.videoWidth,
          duration: canPlayEvent.target.duration,
          fps: canPlayEvent.target.fps
        }
        self.canvas = document.createElement('canvas')
        self.canvas.width = self.sourceStats.width
        self.canvas.height = self.sourceStats.height
        self.canvasCtx = self.canvas.getContext('2d')
        resolve(canPlayEvent)
        self.video.oncanplay = null
      }
      self.video.setAttribute('src', self.url)
    })
  }
  async getFrame (t) {
    await this.drawFrameOnCanvas(t, this.canvasCtx)
    return this.canvas.toDataURL()
  }
  setVideoTimeAndWait (t) {
    var self = this
    return new Promise(function (resolve, reject) {
      self.video.onseeked = function (evt) {
        resolve(evt)
        self.video.onseeked = null
      }
      self.video.currentTime = t.toFixed(2)
    })
  }
  async drawFrameOnCanvas (t, targetCanvasCtx) {
    await this.setVideoTimeAndWait(t)
    targetCanvasCtx.drawImage(this.video, 0, 0)
  }
}

export class GifFrameServer {
  constructor (url) {
    this.url = url
  }
  init () {
    var self = this
    return new Promise((resolve, reject) => {
      gifFrames(
        {
          url: self.url,
          frames: 'all',
          outputType: 'canvas',
          cumulative: true
        },
        function (err, frameData) {
          if (err) { console.log(err) }
          var cumulativeTime = 0
          for (var frame of frameData) {
            cumulativeTime += frame.frameInfo.delay / 100
            frame.untilTime = cumulativeTime
            frame.canvas = frame.getImage()
            frame.png = frame.canvas.toDataURL()
          }
          self.frameData = frameData
          self.sourceStats = {
            width: frameData[0].frameInfo.width,
            height: frameData[0].frameInfo.height,
            duration: cumulativeTime,
            fps: 100 / frameData[0].frameInfo.delay
          }
          resolve()
        }
      )
    })
  }
  getCanvasFrame (t) {
    for (var frame of this.frameData) {
      if (frame.untilTime > t) {
        return frame.canvas
      }
    }
  }
  drawFrameOnCanvas (t, targetCanvasCtx) {
    var canvas = this.getCanvasFrame(t)
    targetCanvasCtx.drawImage(canvas, 0, 0)
  }
  getFrame (t) {
    for (var frame of this.frameData) {
      if (frame.untilTime > t) {
        return frame.png
      }
    }
  }
}
