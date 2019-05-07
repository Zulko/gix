<template lang="pug">
.gif-generation-form
  el-form(label-width='150px')
    el-form-item(label='Record frames')
      el-checkbox(:value='$store.state.globals.recordFrames',
                  @change='v => updateGlobals({recordFrames: v})')
    el-form-item(label='Auto-generate GIF'
                 v-if='$store.state.globals.recordFrames')
      el-checkbox(v-model='autogenerate')
  div(v-if='$store.state.globals.recordFrames'): center
    div(v-if='framesReady && !gifData')
      p Frames are ready!
      el-button(v-if='!autogenerate && !gifData && !makingGIF' @click='makeGIF()') Generate GIF
    div(v-if='!framesReady')
      p
        i(class='el-icon-loading' style='margin-right:0.5em;')
        span Recording Frames...
    p(v-if='makingGIF')
      i(class='el-icon-loading' style='margin-right:0.5em;')
      span GIF generation in progress...
    div(v-if='gifData')
      img(:src='gifData')
      p.copy-to-clipboard Copy to clipboard
      el-input(v-model='gifTitle')
        el-button-group(slot="append")
          el-button(icon="el-icon-download" @click='downloadGIF')
</template>

<script>
import downloadjs from 'downloadjs'
import { mapMutations } from 'vuex'

export default {
  data () {
    return {
      autogenerate: false,
      makingGIF: false,
      gifData: null,
      gifTitle: 'awesome_gix.gif'
    }
  },
  computed: {
    framesReady () {
      return (this.$store.state.globals.gifFramesReady)
    }
  },
  methods: {
    ...mapMutations([
      'updateGlobals'
    ]),
    makeGIF () {
      var self = this
      this.makingGIF = true
      this.gifData = null
      var gif = window.gifWriter
      gif.on('finished', function (blob) {
        self.makingGIF = false
        var reader = new window.FileReader()
        reader.readAsDataURL(blob)
        reader.onloadend = function () {
          var base64data = reader.result
          self.gifData = base64data
        }
      })
      gif.abort()
      gif.render()
    },
    downloadGIF () {
      downloadjs(this.gifData, this.gifTitle, 'image/gif')
    }
  },
  watch: {
    framesReady (nowReady, beforeReady) {
      if (nowReady && this.autogenerate) {
        this.makeGIF()
      }
      if (!nowReady) {
        this.gifData = null
      }
    }
  }
}
</script>

<style lang="scss">
.gif-generation-form {
  .el-input {
    width: 80%;
  }
  .el-input__inner {
    text-align: center !important;
  }
}
</style>
