<template lang="pug">
.editor
  el-container
    el-header
      h1 LOOL
      //- activeTab
    el-container
      el-aside(width="500px")
        el-container
          el-main
            el-tabs(v-model='activeTab')
              el-tab-pane(label='Settings' name='settings')
                el-form(label-width='100px')
                  el-form-item(label='Video URL')
                    el-input(v-model='settings.videoSrc')
                  el-form-item(label='Segment')
                    el-input-number(v-model='settings.segment[1]' size='mini',
                                    :min='settings.segment[0]',
                                    :max='videoDuration',
                                    :step='0.05',
                                    controls-position="right")
                    el-input-number(v-model='settings.segment[0]' size='mini',
                                    :min='0',
                                    :max='settings.segment[1]',
                                    :step='0.05'
                                    controls-position="right")
                    el-slider(v-model='settings.segment' size='small',
                              :min='0'
                              :max='videoDuration',
                              :step='0.05',
                              range)
                  el-form-item(label='FPS')
                    el-input-number(v-model='settings.fps' size='small')
                  el-form-item(label='Show video')
                    el-checkbox(v-model='showVideo')
              el-tab-pane(label='Texts'  name='texts')
                .texts
          el-footer(height='100px')
            el-button-group
              el-input(placeholder='myscene.gif')
                el-button(:loading="true" slot='append')
      el-main(style='text-align: center; padding-left: 5%; padding-right: 5%;')
        transition(enter-active-class='animated zoomIn', leave-active-class='animated zoomOut')
          .video-div(v-show='showVideo')
            el-badge(value="video" class="item")
              el-button(style='padding: 0')
                video#video(controls muted loop autoplay)
                  source(:src="settings.videoSrc" type="video/mp4")
        .canvas-div
          canvas#canvas(:width='videoWidth', :height='videoHeight',
                        :style="{width: videoWidth + 'px', height: videoHeight + 'px'}"
                        @click='canvasClicked')
        .controls

          el-slider(:min='0', :max='videoDuration' v-model='currentTime')
          el-button-group
            el-button(icon='el-icon-d-arrow-left' circle)
            el-button(@click='startOrPause')
              i.el-icon-caret-right(v-if='video && video.paused')
              b(v-else) ◼
            el-button(icon='el-icon-time') {{currentTime.toFixed(2)}}
            el-button(icon='el-icon-location-outline' round) {{mousePosition.x}}, {{mousePosition.y}}
</template>

<script>
export default {
  name: 'Editor',
  data () {
    return {
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
    refresh () {
      this.currentTime = this.video.currentTime
      var ctx = this.canvasCtx
      ctx.drawImage(this.video, 0, 0)
      var t = this.currentTime
      this.settings.texts.map(function (text) {
        if (!((t >= text.segment[0]) && (t <= text.segment[1]))) return
        ctx.font = `${text.size}px ${text.font}`
        ctx.fillStyle = text.color
        ctx.textAlign = text.align
        ctx.fillText(text.text, text.position.x, text.position.y)
      })
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
    this.canvas = document.getElementById('canvas')
    this.canvasCtx = this.canvas.getContext('2d')
    var video = document.getElementById('video')
    this.video = video
    var self = this

    video.addEventListener('canplay', function (e) {
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
