<template lang='pug'>
.gix-animation-wrapper(:style='{width: gifSize.width}')

  .message-container
    transition(enter-active-class="animated bounceIn absolute-position"
               leave-active-class="animated fadeOutUp absolute-position")
      .message(:key='message.key') {{ message.text }}
  .gix-animation-and-layer-container(style='border: 0.5px solid gray')
    .gix-animation-and-layer(:style='gifSize')
      gix-animation(:project='project', @newFrame='onNewFrame',
                    :time.sync='currentTime' :emitFrames='true',
                    :interactive='interactiveMode',
                    @dragged='onElementDragged')
      clickable-layer(v-if='!interactiveMode'
                      :style='gifSize',
                      :clickMode='clickMode', :lastFrame='lastFrame'
                      :currentTime='currentTime')
  .progress-bar(:style='{width: progress}')
  el-switch(size='tiny', v-model='interactiveMode')
</template>

<script>
import GixAnimation from '../../GixAnimation/GixAnimation'
import ClickableLayer from './ClickableLayer'
import GIF from 'gif.js'
import { mapMutations } from 'vuex'
import workerScript from './gif.worker.js.txt'
console.log('SCRIPT', workerScript)
var blob
try {
  blob = new Blob([workerScript], {
    type: 'application/javascript'
  })
} catch (e) { // Backwards-compatibility
  window.BlobBuilder = window.BlobBuilder || window.WebKitBlobBuilder || window.MozBlobBuilder
  blob = new window.BlobBuilder()
  blob.append(workerScript)
  blob = blob.getBlob()
}
var workerScriptBlobURL = URL.createObjectURL(blob)

export default {
  data () {
    return {
      lastFrame: {time: 0},
      previousClickTime: null,
      currentTime: 0,
      recordFrames: true,
      allFramesRecorded: false,
      recordingVoided: true,
      interactiveMode: false
      // gifFrames: []
    }
  },
  methods: {
    ...mapMutations([
      'setGifFramesReady',
      'updateElement'
    ]),
    onNewFrame (frame) {
      var isRewind = frame.time < this.lastFrame.time
      if (!this.recordingVoided && !this.$store.state.globals.gifFramesReady && !isRewind) {
        // this.gifFrames.push(frame)
        // console.log('lol', this.$store.state.globals.gifWriter)
        window.gifWriter.addFrame(
          frame.ctx.canvas,
          {delay: 100 * (frame.time - this.lastFrame.time), copy: true}
        )
        // this.$store.state.globals.gifWriter.addFrame(frame.ctx, )
      }
      if ((this.lastFrame) && (isRewind)) {
        if (!this.recordingVoided) {
          this.setGifFramesReady(true)
        }
        // this.gifFrames = []
        this.recordingVoided = false
      }
      this.lastFrame = frame
    },
    onElementDragged (e) {
      console.log(e)
      this.updateElement({
        elementId: e.element.id,
        update: {
          position: {
            x: e.element.position.x + e.drag.x,
            y: e.element.position.y + e.drag.y
          }
        }
      })
    },
    initializeGifWriter () {
      if (window.gifWriter) {
        window.gifWriter.abort()
      }
      window.gifWriter = new GIF({
        workers: 3,
        quality: 10,
        workerScript: workerScriptBlobURL
      })
    }
  },
  computed: {
    message () {
      var messages = {
        'none': {
          key: 'none',
          text: 'Clicking the GIF will display coordinates and time.'
        },
        'position': {
          key: 'position',
          text: 'Click the GIF to set the element\'s coordinates.'
        },
        'timeSegment': {
          key: 'timeSegment',
          text: 'Click twice on the GIF to set the  element\'s time segment.'
        }
      }
      return messages[this.clickMode.mode]
    },
    project () {
      return this.$store.state.project
    },
    gifSize () {
      return {
        width: this.project.canvas.width + 'px',
        height: this.project.canvas.height + 'px'
      }
    },
    clickMode () {
      return this.$store.state.globals.gifClickMode
    },
    progress () {
      return Math.round(100 * this.currentTime / this.project.duration) + '%'
    }
  },
  components: {
    'gix-animation': GixAnimation,
    'clickable-layer': ClickableLayer
  },
  mounted () {
    this.initializeGifWriter()
  },
  watch: {
    project: {
      deep: true,
      handler () {
        this.recordingVoided = true
        this.setGifFramesReady(false)
        this.initializeGifWriter()
      }
    }
  }
}
</script>
<style lang='scss'>
.gix-animation-wrapper {
  margin: 0 auto;
  .message-container {
    height: 1.1em;
    font-size: 0.8em;
    margin-bottom: 0.5em;
    .message {
      min-width: 500px;
    }
  }
  .gix-animation-and-layer {
    position: relative;
  }
  .clickable-layer {
    position: absolute;
    top: 0;
    left: 0;
  }
  .absolute-position {
    position: absolute;
  }
  .progress-bar {
    height: 3px;
    background-color: blue;
    opacity: 0.3;
    transition: width 0.05s;
  }
}

</style>
