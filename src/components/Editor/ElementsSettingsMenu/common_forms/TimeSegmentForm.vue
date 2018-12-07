<template lang="pug">
.element-time-segment-form
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
  extends: require('../ElementComponentMixin.vue').default,
  methods: {
    updateTimeSegment (val) {
      console.log('asdasdasd', val)
      this.updateElement({timeSegment: {start: val[0], end: val[1]}})
    },
    awaitTimeSegmentClick () {
      this.$store.commit('updateGlobals', {
        gifClickMode: {
          mode: 'timeSegment',
          element: this.element
        }
      })
    }
  },
  computed: {
    timeSegment () {
      return [this.element.timeSegment.start, this.element.timeSegment.end]
    }
  }
}
</script>

<style lang='scss'>
.element-time-segment-form {
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
