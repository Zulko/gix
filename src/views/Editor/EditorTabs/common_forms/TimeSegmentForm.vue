<template lang="pug">
.element-time-segment-form
  div(v-if="element.editorSettings.isMainElement")
    b-message.
      The gix starts and stops with this element. To add elements before or after,
      deselect #[i Main Element] in #[i Project Settings].
  div(v-else)
    b-field(
      :label="`Time segment of this ${element.subtype || element.type} in the project`",
      grouped
    )
      p.control
        b-field(label-position="on-border", label="Start")
          b-numberinput.number-input(
            size="is-small",
            :step="0.01",
            :value="range[0]",
            controls-position="compact",
            @input="(v) => (range = [v, range[1]])"
          )
      p.control(style="margin-left: auto")
        b-field(label-position="on-border", label="End")
          b-numberinput.number-input(
            size="is-small",
            controls-position="compact",
            :step="0.01",
            :value="range[1]",
            @input="(v) => (range = [range[0], v])"
          )
    b-field.slider
      b-slider(
        range,
        :step="0.01",
        size="mini",
        v-model="range",
        :min="0",
        :max="$store.state.project.duration",
        @dragstart="setFreezeGifPreview(true)",
        @dragend="setFreezeGifPreview(false)"
      )
    b-button(@click="setToPlayerCrop") Set to the player control's time segment
</template>

<script>
import { mapMutations } from 'vuex';
import ElementComponentMixin from '../ElementComponentMixin.vue';

export default {
  extends: ElementComponentMixin,
  data() {
    return {
      range: [this.element.timeSegment.start, this.element.timeSegment.end],
    };
  },
  methods: {
    ...mapMutations(['setFreezeGifPreview']),
    updateTimeSegment(val) {
      this.updateElement({ timeSegment: { start: val[0], end: val[1] } });
    },
    setToPlayerCrop() {
      this.updateTimeSegment(this.$store.state.editorPlayerTimeCrop);
    },
  },
  computed: {
    timeSegment() {
      return [this.element.timeSegment.start, this.element.timeSegment.end];
    },
    assetDuration() {
      const stats = this.$store.state.assetStats[this.element.url];
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
        } else if (end !== oldEnd) {
          this.$store.commit('updateEditorPlayerTime', end);
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
    width: 120px;
  }
  .number-input.end-time {
    margin: 0 0;
  }
}
</style>
