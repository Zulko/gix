<template lang='pug'>
.gix-animation-wrapper(:style='{width: gifSize.width}')

  .message-container
    transition(enter-active-class="animated bounceIn absolute-position"
               leave-active-class="animated fadeOutUp absolute-position")
      .message(:key='message.key') {{ message.text }}

  //- .gix-animation-and-layer(:style='gifSize')
  //-   gix-animation(:project='project', @newFrame='onNewFrame',
  //-                 :time.sync='currentTime'
  //-                 @sourceStats="val => $store.commit('updateGlobals', {source: val})")
  //-   clickable-layer(:style='gifSize', :clickMode='clickMode', :lastFrame='lastFrame'
  //-                   :currentTime='currentTime')
</template>

<script>
import GixAnimation from '../../GixAnimation/GixAnimation'
import ClickableLayer from './ClickableLayer'

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
        width: this.$store.state.globals.source.width + 'px',
        height: this.$store.state.globals.source.height + 'px'
      }
    },
    clickMode () {
      return this.$store.state.globals.gifClickMode
    }
  },
  components: {
    'gix-animation': GixAnimation,
    'clickable-layer': ClickableLayer
  }
}
</script>
<style lang='scss'>
.gix-animation-wrapper {
  margin: 0 auto;
  .message-container {
    height: 1.1em;
    font-size: 1em;
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
}

</style>
