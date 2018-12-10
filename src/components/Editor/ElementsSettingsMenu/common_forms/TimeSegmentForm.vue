<template lang="pug">
.element-time-segment-form
  el-tooltip(content="Click me then click 2 times on the GIF")
    .hourglass-button
      el-button(size='mini' circle,
                @click="awaitTimeSegmentClick()")
        timer-icon
  el-slider(range, :step='0.01',
            :value='timeSegment',
            @change='updateTimeSegment'
            :min='0',
            :max='$store.state.project.duration')
</template>

<script>
import AvTimer from 'vue-material-design-icons/AvTimer.vue'
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
  },
  components: {
    'timer-icon': AvTimer
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
    width: 85%;
  }
  .hourglass-button {
    width: 15%;
    text-align: left;
  }
}
</style>
