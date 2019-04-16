// TODO: two SVGs, one for animated content, one for inanimated content

<template lang='pug'>
.elemented-frames-generator
  .unshown
    svg-composition(:svgElements='svgElements', @newFrame='handleNewFrame',
                    :currentTime='currentTime',
                    :svgWidth='project.canvas.width',
                    :svgHeight='project.canvas.height')
    img#svgEffectsImage(:style="videoSizeCSS", crossOrigin="Anonymous",
                        :width="project.canvas.width", :height="project.canvas.height")
    canvas#svgCanvas(:style="videoSizeCSS", :width="project.canvas.width", :height="project.canvas.height")
  .shown(style='padding: 0;')
    canvas#canvas(:style="videoSizeCSS",
                  crossorigin="Anonymous",
                  :width="project.canvas.width", :height="project.canvas.height")
</template>

<script>
// import tools from '../../tools.js'
import { autoFrameServer } from './FrameServer'
import data from './data'
import SvgComposition from './SvgComposition/SvgComposition'
const canvg = require('canvg-browser')

function b64EncodeUnicode (str) {
  return btoa(encodeURIComponent(str).replace(
    /%([0-9A-F]{2})/g, (match, p1) => String.fromCharCode('0x' + p1)
  ))
}

export default {
  props: {
    project: {default: () => ({})},
    emitFrames: {default: false},
    time: {default: 0}
  },
  data () {
    return {
      svgElements: [],
      frameServers: {},
      localElementsData: {},
      frameServer: null,
      currentFrameData: null,
      previousClickTime: null,
      canvas: null,
      svgCanvas: null,
      canvasCtx: null,
      refreshLoop: null,
      currentTime: 0,
      videoWidth: 100,
      videoHeight: 100,
      videoDuration: 10,
      video: null,
      activeTab: 'settings',
      showVideo: false,
      loading: {
        inProgress: false,
        total: 0,
        current: 0
      },
      dateOfLastEmittedFrame: 0
    }
  },
  methods: {
    handleNewFrame (svg) {
      if (this.thereIsSomeAnimation) {
        this.svgEffectsImage.src = 'data:image/svg+xml;base64,' + b64EncodeUnicode(svg)
      } else {
        canvg(this.canvas, svg)
        this.generateElementedGifFrame({svgCanvas: this.canvas})
      }
    },
    async generateElementedGifFrame ({ svgCanvas }) {
      var self = this
      this.canvasCtx.fillRect(0, 0, this.project.canvas.width, this.project.canvas.height)
      this.canvasCtx.drawImage(svgCanvas, 0, 0)
      if (this.emitFrames) {
        // var data = this.canvas.toDataURL()
        var data = null
        var seconds = new Date().getTime() / 1000
        var delta = 1000 * ((1.0 / this.project.fps) - (seconds - this.dateOfLastEmittedFrame))
        setTimeout(function () {
          self.$emit('newFrame', {time: self.currentTime, data, ctx: self.canvasCtx})
          self.dateOfLastEmittedFrame = new Date().getTime() / 1000
          self.refresh()
        }, delta)
      }
    },
    async refresh () {
      var elements = this.project.elements
      if (this.loading.inProgress) {
        elements = data.loadingElements(this.project, this.loading.current, this.loading.total)
        this.currentTime = 0
      }
      this.currentTime += 1.0 / this.project.fps
      var svgElements = []
      for (var element of elements) {
        var start = element.timeSegment.start
        if (this.frameServers[element.id]) {
          var frame = this.frameServers[element.id].getFrame(this.currentTime - start)
          svgElements.push(Object.assign({}, element, {type: 'image', src: frame}))
        } else {
          svgElements.push(element)
        }
      }
      this.svgElements = svgElements
      if (this.currentTime > this.project.duration) {
        this.rewind()
      }
    },
    rewind () {
      this.currentTime = 0
    },
    startRefreshLoop () {
      if (this.refreshLoop) clearInterval(this.refreshLoop)
      this.refreshLoop = setInterval(this.refresh, 1000.0 / this.project.fps)
    },
    startOrPause () {
      if (this.video.paused) {
        this.video.play()
      } else {
        this.video.pause()
      }
    },
    async initiateMissingFrameServers () {
      var assetElementsWithoutFrameServer = this.project.elements.filter(e => ((
        (e.type === 'asset') && !(this.frameServers[e.id] && (this.frameServers[e.id].url === e.url)))
      ))
      var nAssets = assetElementsWithoutFrameServer.length
      if (nAssets > 0) {
        this.loading = {inProgress: true, total: nAssets, current: 0}
        for (var element of assetElementsWithoutFrameServer) {
          this.loading = {...this.loading, current: this.loading.current + 1}
          var frameServer = autoFrameServer(element.url)
          await frameServer.init()
          this.frameServers[element.id] = frameServer
        }
        this.loading = {...this.loading, inProgress: false}
      }
    }
  },
  computed: {
    thereIsSomeAnimation () {
      return this.project.elements.some(function (element) {
        return ['in', 'out', 'loop'].some(e => element.cssAnimation[e].class[0] !== 'none')
      })
    },
    videoSizeCSS () {
      return {
        width: this.project.canvas.width + 'px',
        height: this.project.canvas.height + 'px'
      }
    }
  },
  async mounted () {
    this.canvas = document.getElementById('canvas')
    this.canvasCtx = this.canvas.getContext('2d')
    this.canvasCtx.fillStyle = this.project.canvas.bgColor
    this.svgCanvas = document.getElementById('svgCanvas')
    this.svgEffects = document.getElementById('svgEffects')
    this.svgEffectsImage = document.getElementById('svgEffectsImage')
    var self = this
    this.svgEffectsImage.onload = function () {
      self.generateElementedGifFrame({svgCanvas: self.svgEffectsImage})
    }
    // this.times = []
    // for(var i=0; i < this.project.duration * this.project.fps; i++) {
    //   this.times.push(i / this.project.fps)
    // }
    // console.log(times)
    this.refresh()
    await this.initiateMissingFrameServers()
  },
  components: {
    'svg-composition': SvgComposition
  },
  watch: {
    'project.videoSrc': function (val) {
      this.video.src = val
      this.video.play()
    },
    'currentTime': function (val) {
      this.$emit('update:time', val)
    },
    'projectFps': function (val) {
      this.startRefreshLoop()
    },
    'project.elements': {
      deep: true,
      handler: function (val) {
        this.initiateMissingFrameServers()
      }
    }
  }
}
</script>
<style lang='scss'>
#canvas {
  box-shadow: 0 14px 28px rgba(0,0,0,0.25), 0 10px 10px rgba(0,0,0,0.22);
}
.unshown {
  position: fixed;
  margin-top:-10000px;
}
#svgEffectsImage {
  border: 3px solid black;
}
</style>
