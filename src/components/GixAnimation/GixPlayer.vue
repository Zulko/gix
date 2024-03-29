<template lang='pug'>
.gix-player
  gix-player-controls(
    v-if="showControls",
    :project="project",
    :time.sync="currentTime",
    :params.sync="parameters"
  )
  gix-frame-display(
    :time="currentTime",
    :includeSVGInEmittedFrames="false",
    :project="project",
    @new-frame="handleNewFrame",
    @dragging="(evt) => $emit('dragging', evt)",
    @draggingStopped="(evt) => $emit('draggingStopped', evt)",
    @context-menu="(evt) => $emit('context-menu', evt)",
    @started-loading="isLoading = true",
    @finished-loading="isLoading = false",
    :scale="parameters.scale"
  )
  .gix-player-stats(v-if="showStats")
    | {{ project.canvas.width }}x{{ project.canvas.height }}
    | @{{ parseInt(currentFrameRate) }}/{{ parseInt(parameters.fps) }} fps
</template>

<script>
import WebFont from 'webfontloader';
import GixFrameDisplay from './GixFrameDisplay.vue';
import GixPlayerControls from './GixPlayerControls.vue';

export default {
  props: {
    project: { default: () => ({}), type: Object },
    time: { default: 0, type: Number },
    status: { default: 'play', type: String },
    freeze: { default: false, type: Boolean },
    showControls: { default: false, type: Boolean },
    showStats: { default: false, type: Boolean },
    params: { default: () => ({}), type: Object },
  },
  data() {
    const parameters = {
      scale: 1,
      speedFactor: 1.0,
      ...this.params,
      fps: this.project.fps,
      playTimeCrop: [0, this.project.duration],
      loop: true,
      status: this.status,
    };
    return {
      parameters,
      dateOfLastEmittedFrame: 0,
      lastFramesEmitted: [],
      currentFrameRate: 0,
      isLoading: false,
      currentTime: this.time,
      isBusy: false,
    };
  },
  methods: {
    handleNewFrame() {
      if (!this.isLoading && this.parameters.status === 'play' && !this.isBusy && !this.freeze) {
        this.incrementTimeAfterWait();
        this.isBusy = true;
      }
    },
    incrementTimeAfterWait() {
      const seconds = new Date().getTime() / 1000;
      const delta = 1000 * (1.0 / this.parameters.fps - (seconds - this.dateOfLastEmittedFrame));
      setTimeout(this.incrementTime, Math.max(0, delta));
    },
    incrementTime() {
      let newTime = this.currentTime + this.parameters.speedFactor / this.parameters.fps;
      const [start, end] = this.parameters.playTimeCrop;
      if (newTime >= end) {
        if (this.parameters.loop) {
          newTime = start;
        } else {
          newTime = end;
          this.parameters = { ...this.parameters, status: 'pause' };
        }
      }
      this.isBusy = false;
      this.updateTimeStats();
      this.currentTime = newTime;
    },
    updateTimeStats() {
      this.dateOfLastEmittedFrame = new Date().getTime() / 1000;
      this.lastFramesEmitted = [this.dateOfLastEmittedFrame].concat(this.lastFramesEmitted);
      if (this.lastFramesEmitted.length === 20) {
        const timeXframesAgo = this.lastFramesEmitted.pop();
        this.currentFrameRate = 19.0 / (this.dateOfLastEmittedFrame - timeXframesAgo);
      }
    },
    play() {
      this.incrementTime();
    },
  },
  mounted() {
    const self = this;
    this.$store.commit('setEditorPlayerTimeCrop', [0, this.project.duration]);
    setTimeout(() => {
      self.fontsInProject.forEach((font) => {
        WebFont.load({
          google: {
            families: [font],
          },
        });
      });
    }, 100);
  },
  components: {
    'gix-frame-display': GixFrameDisplay,
    'gix-player-controls': GixPlayerControls,
  },
  computed: {
    fontsInProject() {
      const fonts = this.project.elements
        .map((e) => (e.type === 'text' ? e.font.family : null))
        .filter((e) => e != null);
      fonts.sort();
      return [...new Set(fonts)];
    },
  },
  watch: {
    currentTime(val) {
      this.$emit('update:time', val);
    },
    'parameters.status': {
      handler(val) {
        if (val === 'play' && !this.isLoading) {
          this.play();
        }
      },
    },
    params: {
      deep: true,
      handler(val) {
        this.parameters = {
          scale: 1,
          speedFactor: 1.0,
          ...val,
          fps: this.project.fps,
          playTimeCrop: [0, this.project.duration],
          loop: true,
          status: this.status,
        };
      },
    },
    time(val) {
      this.currentTime = val;
    },
    freeze(val) {
      if (!val && this.status === 'play') {
        this.play();
      }
    },
    status(status) {
      this.parameters = { ...this.parameters, status };
    },
    '$store.state.editorPlayerTime': function preview(time) {
      if (time !== null) {
        this.currentTime = time;
        this.parameters = { ...this.parameters };
        this.$store.commit('updateEditorPlayerTime', null);
      }
    },
  },
};
</script>
<style lang='scss'>
.gix-player {
  text-align: center;
  .gix-player-stats {
    font-size: 12px;
  }
  .context-menu {
    width: 200px;
    position: absolute;
  }
}
</style>
