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
      sourceStats: {
        width: 100,
        height: 100,
        fps: 5,
        duration: 20
      },
      once: true
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
    // async generateElementsFrame () {
    //   if (this.thereIsSomeAnimation) {
    //     var newSvg = tools.cloneWithInlineStyle(this.svgEffects)
    //     var xml = new XMLSerializer().serializeToString(newSvg)
    //     this.svgEffectsImage.src = 'data:image/svg+xml;base64,' + b64EncodeUnicode(xml)
    //   } else {
    //     var svg = new XMLSerializer().serializeToString(this.svgEffects)
    //   comp
    //   compe({svgCanvas: this.svgCanvas})
    //   comp
    // },comp
    async generateElementedGifFrame ({ svgCanvas }) {
      this.canvasCtx.fillRect(0, 0, this.project.canvas.width, this.project.canvas.height)
      this.canvasCtx.drawImage(svgCanvas, 0, 0)
      if (this.emitFrames) {
        var data = this.canvas.toDataURL()
        this.$emit('newFrame', {time: this.currentTime, data})
      }
    },
    async refresh () {
      // if (this.currentTime > 0.5) return
      let fps = this.project.gifOptions.fps
      this.currentTime += 1.0 / fps
      var svgElements = []
      for (var element of this.project.elements) {
        var start = element.timeSegment.start
        if ((start <= this.currentTime) && (element.timeSegment.end >= this.currentTime)) {
          if (this.frameServers[element.id]) {
            var frame = this.frameServers[element.id].getFrame(this.currentTime - start)
            svgElements.push(Object.assign({}, element, {type: 'image', src: frame}))
          } else {
            svgElements.push(element)
          }
        }
      }
      this.svgElements = svgElements
      // this.currentFrameData = await this.frameServer.getFrame(this.currentTime)
      // await this.generateElementsFrame()
      if (this.currentTime > this.project.duration) {
        this.rewind()
      }
    },
    rewind () {
      this.currentTime = 0
    },
    startRefreshLoop () {
      if (this.refreshLoop) clearInterval(this.refreshLoop)
      let fps = this.project.gifOptions.fps
      this.refreshLoop = setInterval(this.refresh, 1000.0 / fps)
    },
    startOrPause () {
      if (this.video.paused) {
        this.video.play()
      } else {
        this.video.pause()
      }
    },
    async initiateMissingFrameServers () {
      var assetElements = this.project.elements.filter(e => (e.type === 'asset'))
      for (var element of assetElements) {
        if (!(this.frameServers[element.id] && (this.frameServers[element.id].url === element.url))) {
          var frameServer = autoFrameServer(element.url)
          await frameServer.init()
          this.frameServers[element.id] = frameServer
          console.log('boya', frameServer)
          // if (element.isMaster) {
          //   this.sourceStats = Object.assign({}, this.frameServer.sourceStats)
          //   this.$emit('sourceStats', {url: url, stats: this.sourceStats})
          // }
        }
      }
    }
  },
  computed: {
    thereIsSomeAnimation () {
      return this.project.elements.some(function (element) {
        return ['in', 'out', 'loop'].some(e => element.cssAnimation[e].class[0] !== 'none')
      })
    },
    sourceHeight () {
      return this.sourceStats.height
    },
    sourceWidth () {
      return this.sourceStats.width
    },
    projectFps () {
      return this.sourceStats.fps
    },
    videoSizeCSS () {
      return {
        width: this.project.canvas.width + 'px',
        height: this.project.canvas.height + 'px'
      }
    }
  },
  async mounted () {
    await this.initiateMissingFrameServers()
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
    this.startRefreshLoop()
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
