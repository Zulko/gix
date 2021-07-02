<template lang="pug">
.time-crop-slider
  b-field(
    :label="`Only play a segment of this ${element.subtype || element.type}`",
    grouped
  )
    p.control
      b-field(label-position="on-border", label="Start")
        b-numberinput.number-input(
          size="is-small",
          controls-position="compact",
          :step="0.01",
          :value="crop[0]",
          @input="(v) => (crop = [v, crop[1]])"
        )
    p.control(style="margin-left: auto")
      b-field.end-time(label-position="on-border", label="End")
        b-numberinput.number-input(
          size="is-small",
          controls-position="compact",
          :step="0.01",
          :value="crop[1]",
          :max="assetDuration",
          @input="(v) => (crop = [crop[0], v])"
        )
    br
  b-field.slider
    b-slider(
      range,
      :step="0.01",
      size="mini",
      v-model="crop",
      :min="0",
      :max="assetDuration"
    )
</template>

<script>
import ElementComponentMixin from '../../../ElementComponentMixin.vue';

export default {
  extends: ElementComponentMixin,
  data() {
    return {
      crop: this.element.timeCrop ? [this.element.timeCrop.start, this.element.timeCrop.end] : [],
    };
  },
  computed: {
    timeCrop() {
      return [this.element.timeCrop.start, this.element.timeCrop.end];
    },
    assetDuration() {
      const stats = this.$store.state.assetStats[this.element.url];
      return stats ? stats.duration : this.$store.state.project.duration;
    },
  },
  methods: {
    updateTimeCrop(val) {
      this.updateElement({ timeCrop: { start: val[0], end: val[1] } });
      if (this.element.editorSettings.isMainElement) {
        const duration = (val[1] - val[0]) / this.element.speedFactor;
        this.$store.commit('updateProject', { duration });
        this.updateElement({ timeSegment: { start: 0, end: duration } });
      }
    },
  },
  watch: {
    'element.timeCrop': {
      deep: true,
      handler(val, oldval) {
        if (!oldval || !val) {
          return;
        }
        if (val.start !== oldval.start || val.end !== oldval.end) {
          this.crop = [val.start, val.end];
        }
      },
    },
    crop: {
      deep: true,
      handler(val, oldval) {
        if (val[0] !== oldval[0] || val[1] !== oldval[1]) {
          this.updateTimeCrop(val);
        }
      },
    },
  },
};
</script>

<style lang='scss'>
.time-crop-slider {
  .slider {
    width: 100%;
  }
  .number-input {
    width: 120px;
  }
  .number-input.end-time {
    margin: 0 0;
  }
}
</style>
