<template lang='pug'>
.gix-player-controls
  section
    b-button.control(
      style="margin-right: 1em",
      @click="parameters = { ...parameters, status: playButtonAction }",
      :icon-right="playButtonAction"
    )
    b-button.show-more(
      size="mini",
      @click="showAllControls = !showAllControls"
    ) {{ showAllControls ? 'Hide' : 'Show' }} player controls
  b-field.optional-controls(v-if="showAllControls", position="is-centered")
    p.control
      b-field(label="speed", label-position="on-border")
        b-select(v-model="parameters.speedFactor")
          option(
            v-for="(value, i) in [0.1, 0.2, 0.5, 0.8, 1, 1.2, 1.5, 2, 3, 5]",
            :value="value",
            :key="i",
            :label="`${parseInt(100 * value)}` + '%'"
          )
    p.control
      b-field(label="scale", label-position="on-border")
        b-select(v-model="parameters.scale")
          option(
            v-for="(value, i) in [0.1, 0.2, 0.5, 0.8, 1, 1.2, 1.5, 2, 3, 5]",
            :value="value",
            :key="i",
            :label="`${parseInt(100 * value)}` + '%'"
          )
    p.control
      b-field(label="fps", label-position="on-border")
        b-select(v-model="parameters.fps")
          option(
            v-for="(value, i) in [project.fps, 5, 10, 15, 20, 25]",
            :value="value",
            :key="i",
            :label="`${value}`"
          )
  .control-time-sliders(:style="{ width: timeCropSliderWidth + 'px' }")
    b-slider.time-crop-bar(
      v-if="showAllControls",
      v-model="playTimeCrop",
      range,
      :min="0",
      :max="project.duration",
      :step="0.05"
    )

    b-slider.time-bar(
      :value="time",
      :min="0",
      :max="project.duration",
      :step="0.05",
      size="is-small",
      @input="(val) => $emit('update:time', val)"
    )
</template>

<script>
export default {
  props: {
    project: { default: () => ({}), type: Object },
    time: { default: 0, type: Number },
    status: { default: 'play', type: String },
    params: { default: () => ({}), type: Object },
  },
  data() {
    return {
      parameters: { ...this.params },
      playTimeCrop: this.params.playTimeCrop,
      showAllControls: false,
    };
  },
  watch: {
    playTimeCrop(val, oldVal) {
      const [oldStart, oldEnd] = oldVal;
      const [start, end] = val;
      if (start !== oldStart) {
        this.$emit('update:time', start);
      }
      if (end !== oldEnd) {
        this.$emit('update:time', end);
      }
      this.parameters = { ...this.parameters, playTimeCrop: val };
    },
    parameters: {
      deep: true,
      handler(val) {
        this.$emit('update:params', val);
      },
    },
    'project.duration': function projectDuration(val, oldVal) {
      const [start, end] = this.playTimeCrop;
      if (end === oldVal) {
        this.playTimeCrop = [start, val];
      }
    },
  },
  computed: {
    timeCropSliderWidth() {
      const previewWidth = this.project.canvas.width * this.parameters.scale;
      return Math.min(800, Math.max(this.project.duration * 100, previewWidth));
    },
    playButtonAction() {
      return this.parameters.status === 'play' ? 'pause' : 'play';
    },
  },
};
</script>
<style lang='scss'>
@import url("https://fonts.googleapis.com/css2?family=Oswald&display=swap");
.gix-player-controls {
  position: relative;
  z-index: 1;
  .control-time-sliders {
    margin: 0 auto;
    .time-bar {
      margin-bottom: -0.05em;
    }
    .time-crop-bar {
      margin-top: -0.5em;
    }
  }
  .optional-controls {
    display: block;
    margin: 1em auto;
  }
}
</style>
