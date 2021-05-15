<template lang="pug">
.element-time-segment-form
  div(v-if="element.editorSettings.isMainElement")
    b-message.
      The gix starts and stops with this element. To add elements before or after,
      deselect #[i Main Element] in #[i Project Settings].
  div(v-else)
    b-field(label="Time segment in the GIX", grouped)
      p.control
        b-field(label-position="on-border", label="Start")
          b-numberinput.number-input(
            :step="0.01",
            :value="range[0]",
            controls-position="compact",
            @input="(v) => (range = [v, range[1]])"
          )
    p.control
      b-field(label-position="on-border", label="End")
        b-numberinput.number-input(
          controls-position="compact",
          :step="0.01",
          :value="range[1]",
          @input="(v) => (range = [range[0], v])"
        )
    br
    b-field.slider
      b-slider(
        range,
        :step="0.01",
        size="mini",
        v-model="range",
        :min="0",
        :max="$store.state.project.duration"
      )

  b-field(label="Select a segment of the clip", grouped)
    p.control
      b-field(label-position="on-border", label="Start")
        b-numberinput.number-input(
          controls-position="compact",
          :step="0.01",
          :value="crop[0]",
          @input="(v) => (crop = [v, crop[1]])"
        )
    p.control
      b-field.end-time(label-position="on-border", label="End")
        b-numberinput.number-input(
          controls-position="compact",
          :step="0.01",
          :value="crop[1]",
          :max="assetDuration",
          @input="(v) => (crop = [crop[0], v])"
        )
  b-field.slider
    b-slider(
      range,
      :step="0.01",
      size="mini",
      v-model="crop",
      :min="0",
      :max="assetDuration"
    )

  b-field.end-time(label="Speed factor", grouped)
    b-select(:value="element.speedFactor", @input="updateSpeed", size="mini")
      option(
        v-for="(value, i) in [0.1, 0.2, 0.5, 0.8, 1, 1.2, 1.5, 2, 3, 5]",
        :value="value",
        :key="i",
        :label="`${parseInt(100 * value)}` + '%'"
      )
</template>

<script>
import ElementComponentMixin from '../ElementComponentMixin.vue';

export default {
  extends: ElementComponentMixin,
  data() {
    return {
      range: [this.element.timeSegment.start, this.element.timeSegment.end],
      crop: this.element.timeCrop ? [this.element.timeCrop.start, this.element.timeCrop.end] : [],
    };
  },
  methods: {
    updateTimeSegment(val) {
      this.updateElement({ timeSegment: { start: val[0], end: val[1] } });
    },
    updateTimeCrop(val) {
      this.updateElement({ timeCrop: { start: val[0], end: val[1] } });
      if (this.element.editorSettings.isMainElement) {
        const duration = (val[1] - val[0]) / this.element.speedFactor;
        this.$store.commit('updateProject', { duration });
        this.updateElement({ timeSegment: { start: 0, end: duration } });
      }
    },
    updateSpeed(val) {
      this.updateElement({ speedFactor: val });
      if (this.element.editorSettings.isMainElement) {
        const { timeCrop } = this.element;
        const duration = (timeCrop.end - timeCrop.start) / val;
        this.$store.commit('updateProject', { duration });
        this.updateElement({ timeSegment: { start: 0, end: duration } });
      }
    },
  },
  computed: {
    timeSegment() {
      return [this.element.timeSegment.start, this.element.timeSegment.end];
    },
    timeCrop() {
      return [this.element.timeCrop.start, this.element.timeCrop.end];
    },
    assetDuration() {
      const stats = this.$store.state.assetStats[this.element.id];
      return stats ? stats.duration : this.$store.state.project.duration;
    },
  },
  watch: {
    'element.timeSegment': {
      deep: true,
      handler(val, oldval) {
        if (val.start !== oldval.start || val.end !== oldval.end) {
          this.range = [this.element.timeSegment.start, this.element.timeSegment.end];
        }
      },
    },
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
    range: {
      deep: true,
      handler(val, oldval) {
        const [oldStart, oldEnd] = oldval;
        const [start, end] = val;
        if (start !== oldStart || end !== oldEnd) {
          this.updateTimeSegment(val);
        }
        if (start !== oldStart) {
          this.$store.commit('updateEditorPlayerTime', start);
        }
        if (end !== oldEnd) {
          this.$store.commit('updateEditorPlayerTime', end);
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
.element-time-segment-form {
  .slider {
    width: 100%;
  }
  .number-input {
    width: 150px;
  }
  .number-input.end-time {
    margin: 0 0;
  }
}
</style>
