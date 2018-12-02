<template lang="pug">
.caption-time-segment-form
  el-tooltip(content="Click me then click 2 times on the GIF")
    .hourglass-button
      el-button(size='mini' circle,
                @click="awaitTimeSegmentClick()")
        icon(name='hourglass-half')
  el-slider(range, :step='0.01',
            :value='timeSegment',
            @change='updateTimeSegment'
            :min='$store.state.project.source.transform.timeSegment.start',
            :max='$store.state.project.source.transform.timeSegment.end')
</template>

<script>
export default {
  extends: require('../CaptionComponent.vue').default,
  methods: {
    updateTimeSegment (val) {
      console.log('asdasdasd', val)
      this.updateCaption({timeSegment: {start: val[0], end: val[1]}})
    },
    awaitTimeSegmentClick () {
      this.$store.commit('updateGlobals', {
        gifClickMode: {
          mode: 'timeSegment',
          caption: this.caption
        }
      })
    }
  },
  computed: {
    timeSegment () {
      return [this.caption.timeSegment.start, this.caption.timeSegment.end]
    }
  }
}
</script>

<style lang='scss'>
.caption-time-segment-form {
  .hourglass-button, .el-slider {
    display: inline-block;
    vertical-align: middle;
  }
  .el-slider {
    width: 90%;
  }
  .hourglass-button {
    width: 10%;
    text-align: center;
  }
}
</style>
