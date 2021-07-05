<template lang="pug">
section.project-settings
  b-field(label="Gix duration", horizontal)
    b-numberinput.number-input(
      controls-position="compact",
      :step="0.1",
      min="0.1",
      max="180",
      v-model="duration",
      size="is-small"
    )
  b-field(label="Default FPS", horizontal)
    b-numberinput.number-input(
      controls-position="compact",
      :step="1",
      min="1",
      max="50",
      v-model="defaultFPS",
      size="is-small"
    )
  b-field(label="Background color", horizontal)
    b-field(grouped)
      b-input(type="color", v-model="backgroundColor", style="width: 45px")
      b-input(v-model="backgroundColor", style="width: 90px")
  b-field(grouped, multiline-group, label="Gix size", horizontal)
    b-field(grouped)
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
      br
      p.control(style="margin-top: -0.5em")
        span Keep ratio
        br
        b-checkbox(v-model="keepAspectRatio")

  b-field(label="Add pixels")
  b-field(
    style="display: inline-block; margin-right: 1em; text-transform: capitalize",
    v-for="side in ['top', 'bottom', 'left', 'right']",
    :key="side",
    :label="side"
  )
    p.control(v-for="value in [-10, -1, 1, 10]", :key="value")
      b-button(size="is-small", @click="addPixels(side, value)").
        {{ value > 0 ? `+${value}` : value }}
</template>

<script>
import { mapMutations } from 'vuex';
import lodash from 'lodash';

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
    addPixels(side, value) {
      if (side === 'right' || side === 'left') {
        const width = Math.max(1, this.$store.state.project.canvas.width + value);
        this.updateProject({ canvas: { width } });
      }
      if (side === 'top' || side === 'bottom') {
        const height = Math.max(1, this.$store.state.project.canvas.height + value);
        this.updateProject({ canvas: { height } });
      }
      if (side === 'left') {
        this.updateProject({
          elements: this.$store.state.project.elements.map((e) => {
            const newElement = JSON.parse(JSON.stringify(e));
            lodash.merge(newElement, { position: { x: e.position.x + value } });
            return newElement;
          }),
        });
      }
      if (side === 'top') {
        this.updateProject({
          elements: this.$store.state.project.elements.map((e) => {
            const newElement = JSON.parse(JSON.stringify(e));
            lodash.merge(newElement, { position: { y: e.position.y + value } });
            return newElement;
          }),
        });
      }
    },
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
.project-settings {
  .number-input {
    width: 150px;
    margin-right: 1em;
  }
  .field {
    margin-bottom: 1em;
  }
}
</style>
