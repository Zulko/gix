<template lang="pug">
.settings-tab
  b-field(grouped, multiline-group, label="Gix size")
    p.control
      b-field(label="Width", label-position="on-border")
        b-numberinput.number-input(
          controls-position="compact",
          :step="1",
          min="5",
          max="1500",
          v-model="canvasWidth"
        )
    p.control
      b-field(label="Height", label-position="on-border")
        b-numberinput.number-input(
          controls-position="compact",
          :step="1",
          min="5",
          max="1500",
          v-model="canvasHeight"
        )
    p.control(style="margin-top: -0.5em")
      span Keep ratio
      br
      b-checkbox(v-model="keepAspectRatio")
  b-field(grouped, group-multiline)
    b-field(label="Gix duration")
      b-numberinput.number-input(
        controls-position="compact",
        :step="0.1",
        min="0.1",
        max="180",
        v-model="duration"
      )
    b-field(label="Default FPS")
      b-numberinput.number-input(
        controls-position="compact",
        :step="1",
        min="1",
        max="50",
        v-model="defaultFPS"
      )
    b-field(label="Background color")
      b-input(type="color", v-model="backgroundColor", style="width: 45px")
      b-input(v-model="backgroundColor", style="width: 90px")
</template>

<script>
import { mapMutations } from 'vuex';

export default {
  data() {
    const { canvas } = this.$store.state.project;
    return {
      keepAspectRatio: true,
      aspectRatio: canvas.width / canvas.height,
    };
  },
  computed: {
    canvas() {
      return this.$store.state.project.canvas;
    },
    canvasWidth: {
      get() {
        return this.canvas ? this.canvas.width : 0;
      },
      set(width) {
        if (width === this.canvasWidth) {
          return;
        }
        const height = this.keepAspectRatio
          ? Math.round(width / this.aspectRatio)
          : this.canvasHeight;
        this.updateProject({ canvas: { width, height } });
        const self = this;
        this.$store.state.project.elements.forEach((e) => {
          if (e.editorSettings.isMainElement) {
            self.updateElement({
              elementId: e.id,
              update: { size: { width, height } },
            });
          }
        });
      },
    },
    canvasHeight: {
      get() {
        return this.canvas ? this.canvas.height : 0;
      },
      set(height) {
        if (height === this.canvasHeight) {
          return;
        }
        const width = this.keepAspectRatio
          ? Math.round(height * this.aspectRatio)
          : this.canvasWidth;
        this.updateProject({ canvas: { width, height } });
        const self = this;
        this.$store.state.project.elements.forEach((e) => {
          if (e.editorSettings.isMainElement) {
            self.updateElement(e, { size: { width, height } });
          }
        });
      },
    },
    backgroundColor: {
      get() {
        return this.canvas ? this.canvas.backgroundColor : 0;
      },
      set(backgroundColor) {
        if (backgroundColor === this.backgroundColor) {
          return;
        }
        this.updateProject({ canvas: { backgroundColor } });
      },
    },
    duration: {
      get() {
        return this.$store.state.project.duration;
      },
      set(duration) {
        if (duration === this.duration) {
          return;
        }
        this.updateProject({ duration });
        const self = this;
        this.$store.state.project.elements.forEach((e) => {
          if (e.editorSettings.isMainElement) {
            self.updateElement({
              elementId: e.id,
              update: { timeSegment: { start: 0, end: duration } },
            });
          }
        });
      },
    },
    defaultFPS: {
      get() {
        return this.$store.state.project.fps;
      },
      set(fps) {
        if (fps === this.defaultFPS) {
          return;
        }
        this.updateProject({ fps });
      },
    },
  },
  methods: {
    ...mapMutations(['updateProject', 'updateElement']),
  },
  watchers: {
    keepAspectRatio(val) {
      if (val) {
        this.aspectRatio = this.canvas.width / this.canvas.height;
      }
    },
  },
};
</script>
<style lang="scss">
.settings-tab {
  .number-input {
    width: 150px;
    margin-right: 1em;
  }
  .field {
    margin-bottom: 1em;
  }
}
</style>
