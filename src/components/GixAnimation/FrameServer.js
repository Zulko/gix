var gifFrames = require('gif-frames')
var axios = require('axios')
var gifInfo = require('gif-info')

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

  async getInfos () {
    var response = await axios({url: this.url, method: 'GET', responseType: 'arraybuffer'})
    var infos = gifInfo(response.data)
    console.log('infos', infos)
    var duration = infos.durationChrome / 1000
    return {
      height: infos.height,
      width: infos.width,
      duration: duration,
      nFrames: infos.images.length,
      defaultDelay: duration / infos.images.length,
      fps: infos.images.length / duration
    }
  }
  init () {
    var self = this
    return new Promise(async function (resolve, reject) {
      self.sourceStats = await self.getInfos()
      console.log('asyncInfos', self.sourceStats)
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
            var delay = frame.frameInfo.delay
            cumulativeTime += (delay === 0 ? self.sourceStats.defaultDelay : (delay / 100))
            frame.untilTime = cumulativeTime
            frame.canvas = frame.getImage()
            frame.png = frame.canvas.toDataURL()
          }
          self.frameData = frameData
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
  getFrame (t, endBehaviour = 'loop') {
    if (t > this.duration) {
      if (endBehaviour === 'loop') {
        t = t % this.sourceStats.duration
      } else if (endBehaviour === 'freeze') {
        return this.frameData[this.frameData.length - 1].png
      } else {
        return null
      }
    }
    for (var frame of this.frameData) {
      if (frame.untilTime > t) {
        return frame.png
      }
    }
  }
}

export function autoFrameServer (url) {
  var frameServer
  if (url.endsWith('.gif')) {
    frameServer = new GifFrameServer(url)
  } else {
    frameServer = new VideoFrameServer(url)
  }
  return frameServer
}
