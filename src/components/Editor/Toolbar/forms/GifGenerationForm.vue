<template lang="pug">
.gif-generation-form
  p
    span Autogenerate GIF when frames are ready
    br
    el-switch(v-model='autogenerate')
  div(v-if='framesReady')
    p Frames are ready!
    el-button(v-if='!autogenerate' @click='makeGIF()') Generate GIF
    p(v-if='makingGIF')
      i(class='el-icon-loading' style='margin-right:0.5em;')
      span GIF generation in progress...
    p
      img(v-if='gifData' :src='gifData')
  div(v-else)
    p
      i(class='el-icon-loading' style='margin-right:0.5em;')
      span Recording Frames...
</template>

<script>
export default {
  data () {
    return {
      autogenerate: false,
      makingGIF: false,
      gifData: null
    }
  },
  computed: {
    framesReady () {
      return (this.$store.state.globals.gifFramesReady)
    }
  },
  methods: {
    makeGIF () {
      var self = this
      this.makingGIF = true
      this.gifData = null
      var gif = window.gifWriter
      console.log(gif)
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
  text-align: center;
}
</style>
