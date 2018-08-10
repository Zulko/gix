<template lang="pug">
v-app#inspire(dark)
  v-navigation-drawer(v-model="drawer" clipped fixed app)
    v-list(dense)
      v-list-tile(@click="")
        v-list-tile-action
          v-icon dashboard
        v-list-tile-content
          v-list-tile-title Dashboard
      v-list-tile(@click="")
        v-list-tile-action
          v-icon settings
        v-list-tile-content
          v-list-tile-title Settings
  v-toolbar(app="" fixed="" clipped-left="")
    v-toolbar-side-icon(@click.stop="drawer = !drawer")
    v-toolbar-title Application
  v-content
    v-container(fluid= fill-height)
      v-container
        v-text-field(label="Video URL" append-icon="close" v-model='settings.videoSrc')
      v-layout(justify-center align-center)
        video#video(controls muted loop autoplay v-show='false')
          source(:src="settings.videoSrc" type="video/mp4")
      v-layout(justify-center align-center style="position: fixed; margin-top:-10000px;")
        svg#svgEffects(
            :viewbox="'0 ' + '0 ' + videoWidth + ' ' + videoHeight",
            xmlns="http://www.w3.org/2000/svg",
            :style="{width: videoWidth + 'px', height: videoHeight + 'px', color: 'black'}"
          )
          //- g(transform='translate(50 50)')
          //-   circle.animated.infinite.pulse(cx="0" cy="0" r="20" fill='red')
          g(transform='translate(530 310)')
            text.animated.infinite.swing(style='font-family: "Impact"; font-size: 50px;' fill='yellow' stroke='black' text-anchor='middle') test
      v-layout(justify-center align-center style="position: fixed; margin-top:-1000px;")
        img#svgEffectsImage(:style="{width: videoWidth + 'px', height: videoHeight + 'px'}")
      v-layout(justify-center align-center)
        canvas#canvas(:style="{width: videoWidth + 'px', height: videoHeight + 'px'}"
                      :width="videoWidth", :height="videoHeight")
      v-layout(justify-center align-center)
        v-toolbar(dark tabs)
          v-toolbar-side-icon
          v-toolbar-title Texts & Effects
          v-spacer
          v-btn(icon)
            v-icon more_vert
          v-tabs(slot="extension" v-model="tab" grow="")
            v-tabs-slider(color="yellow")
            v-tab(v-for="item in items" :key="item")
              | {{ item }}
      v-layout(justify-center align-center)
        v-tabs-items(v-model="tab")
          v-tab-item(v-for="item in items" :key="item")
            v-card(flat="")
              v-card-text {{ text }}
        //- v-btn(@click='svg2canvas') bla
        //- v-flex(shrink="")
          //- v-tooltip(right="")
          //-   v-btn(slot="activator" :href="source" icon large target="_blank")
          //-     v-icon(large) code
          //-   span Source
          v-tooltip(right="")
            v-btn(slot="activator" icon large href="https://codepen.io/johnjleider/pen/qxQWda" target="_blank")
              v-icon(large="") mdi-codepen
            span Codepen
  v-footer(app="" fixed="")
    span © 2017
</template>

<script>

import tools from '../tools.js'
export default {
  name: 'Editor',
  data () {
    return {
      tab: null,
      items: [
        'web', 'shopping', 'videos', 'images', 'news'
      ],
      text: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.',
      drawer: false,
      source: '',
      settings: {
        segment: [1, 3],
        videoSrc: 'https://i.imgur.com/S8QQRI4.mp4',
        fps: 10,
        texts: [
          {
            segment: [1, 2],
            text: 'Wow',
            font: 'Impact',
            color: 'yellow',
            size: 30,
            align: 'center',
            position: {x: 100, y: 50}
          }
        ]
      },
      svgEffects: null,
      svgEffectsImage: null,
      canvas: null,
      canvasCtx: null,
      refreshLoop: null,
      currentTime: 0,
      videoWidth: 100,
      videoHeight: 100,
      videoDuration: 10,
      video: null,
      activeTab: 'settings',
      showVideo: false,
      mousePosition: { x: 0, y: 0 }
    }
  },
  methods: {
    svg2canvas () {
      var newSvg = tools.cloneWithInlineStyle(this.svgEffects)
      var xml = new XMLSerializer().serializeToString(newSvg)
      this.svgEffectsImage.src = 'data:image/svg+xml;base64,' + btoa(xml)
    },
    refresh () {
      var self = this
      this.currentTime = this.video.currentTime
      var ctx = this.canvasCtx

      var t = this.currentTime
      // this.settings.texts.map(function (text) {
      //   if (!((t >= text.segment[0]) && (t <= text.segment[1]))) return
      //   ctx.font = `${text.size}px ${text.font}`
      //   ctx.fillStyle = text.color
      //   ctx.textAlign = text.align
      //   ctx.fillText(text.text, text.position.x, text.position.y)
      // })
      this.svg2canvas()
      if (t > this.settings.segment[1]) this.rewind()
    },
    startRefreshLoop () {
      if (this.refreshLoop) clearInterval(this.refreshLoop)
      this.refreshLoop = setInterval(this.refresh, 1000.0 / this.settings.fps)
    },
    canvasClicked (e) {
      this.mousePosition = {
        x: e.pageX - e.target.offsetLeft,
        y: e.pageY - e.target.offsetTop
      }
    },
    startOrPause () {
      if (this.video.paused) {
        this.video.play()
      } else {
        this.video.pause()
      }
    },
    rewind () {
      this.video.currentTime = this.settings.segment[0]
    }
  },
  mounted () {
    var self = this
    this.video = document.getElementById('video')
    this.canvas = document.getElementById('canvas')
    this.canvasCtx = this.canvas.getContext('2d')
    this.svgEffects = document.getElementById('svgEffects')
    this.svgEffectsImage = document.getElementById('svgEffectsImage')
    this.svgEffectsImage.onload = function () {
      self.canvasCtx.drawImage(self.video, 0, 0)
      self.canvasCtx.drawImage(self.svgEffectsImage, 0, 0)
    }
    this.video.addEventListener('canplay', function (e) {
      self.videoHeight = e.target.videoHeight
      self.videoWidth = e.target.videoWidth
      self.videoDuration = e.target.duration
    })
    this.video.play()
    this.startRefreshLoop()
  },
  watch: {
    'settings.videoSrc': function (val) {
      console.log(this.video)
      this.video.src = val
      this.video.play()
    },
    'settings.fps': function (val) {
      this.startRefreshLoop()
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
h1, h2 {
  font-weight: normal;
}
ul {
  list-style-type: none;
  padding: 0;
}
li {
  display: inline-block;
  margin: 0 10px;
}
a {
  color: #42b983;
}

#canvas {
  border: 1px solid black;
  cursor: pointer;
}
</style>
