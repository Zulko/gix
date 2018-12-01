<template lang='pug'>
.captioned-frames-wrapper(:style='{width: gifSize.width}')

  .message-container
    transition(enter-active-class="animated bounceIn absolute-position"
               leave-active-class="animated fadeOutUp absolute-position")
      .message(:key='message.key') {{ message.text }}

  .captioned-frames(:style='gifSize')
    captioned-frames(:project='project', @newFrame='onNewFrame',
                     :time.sync='currentTime'
                     @sourceStats="val => $store.commit('updateGlobals', {source: val})")
    click-layer(:style='gifSize', :clickMode='clickMode', :lastFrame='lastFrame'
                :currentTime='currentTime')
</template>

<script>
export default {
  data () {
    return {
      lastFrame: null,
      previousClickTime: null,
      currentTime: 0
    }
  },
  methods: {
    onNewFrame (frame) {
      this.lastFrame = frame
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
          text: 'Click the GIF to set the caption\'s coordinates.'
        },
        'timeSegment': {
          key: 'timeSegment',
          text: 'Click twice on the GIF to set the  caption\'s time segment.'
        }
      }
      return messages[this.clickMode.mode]
    },
    project () {
      return this.$store.state.project
    },
    gifSize () {
      return {
        width: this.$store.state.globals.source.width + 'px',
        height: this.$store.state.globals.source.height + 'px'
      }
    },
    clickMode () {
      return this.$store.state.globals.gifClickMode
    }
  },
  components: {
    'captioned-frames': require('./CaptionedFrames.vue').default,
    'click-layer': require('./ClickLayer.vue').default
  }
}
</script>
<style lang='scss'>
@import url('https://fonts.googleapis.com/css?family=Black+Han+Sans');
@import url('https://fonts.googleapis.com/css?family=Ranga');
.captioned-frames-wrapper {
  margin: 0 auto;
  .message-container {
    height: 1.1em;
    font-size: 1em;
    margin-bottom: 0.5em;
  }
  .captioned-frames {
    position: relative;
  }
  .captioned-frames-generator, .click-layer {
    position: absolute;
    top: 0;
    left: 0;
  }
  .absolute-position {
    position: absolute;
  }
}

</style>
