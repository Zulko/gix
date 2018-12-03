// TODO: two SVGs, one for animated content, one for inanimated content

<template lang='pug'>
.captioned-frames-generator
  .unshown
    svg#svgEffects(
      :width="sourceWidth", :height="sourceHeight"
      :viewbox="`0 0 ${sourceWidth} ${sourceHeight}`",
      xmlns="http://www.w3.org/2000/svg",
      :style="videoSizeCSS")
      image(:width="sourceWidth", :height="sourceHeight", :xlink:href="currentFrameData")
      svg-caption(v-for='caption in project.captions', :key='caption.id',
                  :caption='caption', :currentTime='currentTime')
    img#svgEffectsImage(:style="videoSizeCSS", crossOrigin="Anonymous",
                        :width="sourceWidth", :height="sourceHeight")
    canvas#svgCanvas(:style="videoSizeCSS", :width="sourceWidth", :height="sourceHeight")
  .shown(style='padding: 0')
    canvas#canvas(:style="videoSizeCSS",
                  style='margin: 0; max-width:100%;',
                  crossorigin="anonymous",
                  :width="sourceWidth", :height="sourceHeight")
</template>

<script>
import tools from '../../tools.js'
import { VideoFrameServer, GifFrameServer } from './FrameServer'
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
    async generateCaptionsFrame () {
      if (this.someAnimation) {
        var newSvg = tools.cloneWithInlineStyle(this.svgEffects)
        var xml = new XMLSerializer().serializeToString(newSvg)
        this.svgEffectsImage.src = 'data:image/svg+xml;base64,' + b64EncodeUnicode(xml)
      } else {
        var svg = new XMLSerializer().serializeToString(this.svgEffects)
        canvg(this.svgCanvas, svg)
        this.generateCaptionedGifFrame({svgCanvas: this.svgCanvas})
      }
    },
    async generateCaptionedGifFrame ({ svgCanvas }) {
      this.canvasCtx.drawImage(svgCanvas, 0, 0)
      if (this.emitFrames) {
        var data = this.canvas.toDataURL()
        this.$emit('newFrame', {time: this.currentTime, data})
      }
    },
    async refresh () {
      let fps = this.project.gifOptions.fps
      this.currentTime += 1.0 / fps
      this.currentFrameData = await this.frameServer.getFrame(this.currentTime)
      await this.generateCaptionsFrame()
      if (this.currentTime > this.project.source.transform.timeSegment.end) {
        this.rewind()
      }
    },
    rewind () {
      this.currentTime = this.project.source.transform.timeSegment.start
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
    }
  },
  computed: {
    someAnimation () {
      return this.project.captions.some(function (caption) {
        return ['in', 'out', 'loop'].some(e => caption.animation[e].class[0] !== 'none')
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
        width: this.sourceWidth + 'px',
        height: this.sourceHeight + 'px'
      }
    }
  },
  async mounted () {
    if (this.project.source.url.endsWith('.gif')) {
      this.frameServer = new GifFrameServer(this.project.source.url)
    } else {
      this.frameServer = new VideoFrameServer(this.project.source.url)
    }
    await this.frameServer.init()
    this.sourceStats = Object.assign({}, this.frameServer.sourceStats)
    this.$emit('sourceStats', this.sourceStats)
    this.canvas = document.getElementById('canvas')
    this.canvas.width = this.sourceStats.width
    this.canvas.height = this.sourceStats.height
    this.canvasCtx = this.canvas.getContext('2d')
    this.svgCanvas = document.getElementById('svgCanvas')
    this.svgEffects = document.getElementById('svgEffects')
    this.svgEffectsImage = document.getElementById('svgEffectsImage')
    var self = this
    this.svgEffectsImage.onload = function () {
      self.generateCaptionedGifFrame({svgCanvas: self.svgEffectsImage})
    }
    this.startRefreshLoop()
  },
  components: {
    'svg-caption': require('./SvgCaption.vue').default
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
    }
  }
}
</script>
<style lang='scss'>
.unshown {
  position: fixed;
  margin-top:-10000px;
}
#svgEffectsImage {
  border: 3px solid black;
}
</style>
