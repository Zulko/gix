<template lang="pug">
.element-time-segment-form
  span Time segment:&nbsp;
  el-input-number(
      size='mini', controls-position="right",
      :step='0.01',
      style='width:90px',
      :value='range[0]',
      @input='v => range = [v, range[1]]')
  span &nbsp;-&nbsp;
  el-input-number(
      size='mini', controls-position="right",
      :step='0.01',
      style='width:90px',
      :value='range[1]',
      @input='v => range = [range[0], v]')
  span &nbsp;
  el-tooltip(content="Click me then click twice on the GIX preview to set a time range")
    .hourglass-button
      el-button(size='mini' circle,
                @click="awaitTimeSegmentClick()")
        timer-icon
  center
    el-slider(range, :step='0.01',
              size='mini',
              v-model='range',
              :min='0',
              :max='$store.state.project.duration')
  div(v-if="element.timeCrop && infos.duration")
    span Time crop:&nbsp;
    el-input-number(
        size='mini', controls-position="right",
        :step='0.01',
        style='width:90px',
        :value='crop[0]',
        @input='v => crop = [v, crop[1]]')
    span &nbsp;-&nbsp;
    el-input-number(
        size='mini', controls-position="right",
        :step='0.01',
        style='width:90px',
        :value='crop[1]',
        @input='v => crop = [crop[0], v]')
    center
      el-slider(range, :step='0.01',
                size='mini',
                v-model='crop',
                :min='0',
                :max='infos.duration')
  div(v-if='element.speedFactor && infos.duration')
    span Speed factor:&nbsp;
    el-input-number(
        size='mini', controls-position="right",
        :step='0.01',
        style='width:90px',
        :min='0.01',
        :value='element.speedFactor',
        @input='v => updateElement({speedFactor: v})')
</template>

<script>
import AvTimer from 'vue-material-design-icons/AvTimer.vue'
export default {
  extends: require('../ElementComponentMixin.vue').default,
  data () {
    return {
      range: [this.element.timeSegment.start, this.element.timeSegment.end],
      crop: this.element.timeCrop ? [this.element.timeCrop.start, this.element.timeCrop.end] : []
    }
  },
  methods: {
    updateTimeSegment (val) {
      this.updateElement({timeSegment: {start: val[0], end: val[1]}})
    },
    updateTimeCrop (val) {
      this.updateElement({timeCrop: {start: val[0], end: val[1]}})
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
    },
    timeCrop () {
      return [this.element.timeCrop.start, this.element.timeCrop.end]
    }
  },
  components: {
    'timer-icon': AvTimer
  },
  watch: {
    'element.timeSegment': {
      deep: true,
      handler (val, oldval) {
        if ((val.start !== oldval.start) || (val.end !== oldval.end)) {
          this.range = [this.element.timeSegment.start, this.element.timeSegment.end]
        }
      }
    },
    'element.timeCrop': {
      deep: true,
      handler (val, oldval) {
        if ((val.start !== oldval.start) || (val.end !== oldval.end)) {
          this.crop = [this.element.timeCrop.start, this.element.timeCrop.end]
        }
      }
    },
    range: {
      deep: true,
      handler (val, oldval) {
        if ((val[0] !== oldval[0]) || (val[1] !== oldval[1])) {
          this.updateTimeSegment(val)
        }
      }
    },
    crop: {
      deep: true,
      handler (val, oldval) {
        if ((val[0] !== oldval[0]) || (val[1] !== oldval[1])) {
          this.updateTimeCrop(val)
        }
      }
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
    width: 85%;
  }
  .hourglass-button {
    width: 15%;
    svg {
      height: 15px;
      width: 20px;
    }
  }
}
</style>
