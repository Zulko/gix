// TODO: two SVGs, one for animated content, one for inanimated content

<template lang='pug'>
.captioned-frames-generator
  .unshown
    video#video(v-show='false' muted loop autoplay crossOrigin="Anonymous")
      source(:src=" project.source.url" type="video/mp4")
    svg#svgEffects(
      :width="sourceWidth", :height="sourceHeight"
      :viewbox="`0 0 ${sourceWidth} ${sourceHeight}`",
      xmlns="http://www.w3.org/2000/svg",
      :style="videoSizeCSS")
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
        fps: 10,
        duration: 20
      },
      once: true
    }
  },
  methods: {
    generateCaptionsFrame () {
      if (this.someAnimation) {
        var newSvg = tools.cloneWithInlineStyle(this.svgEffects)
        var xml = new XMLSerializer().serializeToString(newSvg)
        this.svgEffectsImage.src = 'data:image/svg+xml;base64,' + b64EncodeUnicode(xml)
        if ((this.once) && (this.currentTime > 1.5)) {
          this.once = false
          console.log(this.svgEffectsImage)
        }
      } else {
        var svg = new XMLSerializer().serializeToString(this.svgEffects)
        canvg(this.svgCanvas, svg)
        this.generateCaptionedGifFrame({svgCanvas: this.svgCanvas})
      }
    },
    generateCaptionedGifFrame ({ svgCanvas }) {
      this.canvasCtx.drawImage(this.video, 0, 0)
      this.canvasCtx.drawImage(svgCanvas, 0, 0)
      if (this.once && (this.currentTime > 1.2)) {
        console.log(this.canvasCtx, svgCanvas)
        this.once = false
      }
      if (this.emitFrames) {
        var data = this.canvas.toDataURL()
        this.$emit('newFrame', {time: this.currentTime, data})
      }
    },
    refresh () {
      this.currentTime = this.video.currentTime
      this.generateCaptionsFrame()
      if (this.currentTime > this.project.source.transform.timeSegment.end) {
        this.rewind()
      }
    },
    rewind () {
      this.video.currentTime = this.project.source.transform.timeSegment.start
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
  mounted () {
    var self = this
    this.video = document.getElementById('video')
    this.canvas = document.getElementById('canvas')
    this.svgCanvas = document.getElementById('svgCanvas')
    this.canvasCtx = this.canvas.getContext('2d')
    this.svgEffects = document.getElementById('svgEffects')
    this.svgEffectsImage = document.getElementById('svgEffectsImage')
    this.svgEffectsImage.onload = function () {
      self.generateCaptionedGifFrame({svgCanvas: self.svgEffectsImage})
    }
    this.video.addEventListener('canplay', function (e) {
      self.sourceStats = {
        height: e.target.videoHeight,
        width: e.target.videoWidth,
        duration: e.target.duration,
        fps: e.target.fps
      }
      self.$emit('sourceStats', self.sourceStats)
    })
    this.video.play()
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
