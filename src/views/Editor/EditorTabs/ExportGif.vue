<template lang="pug">
.export-gif
  b-field(group-multiline, grouped, style="margin-top: 2em")
    p.control
      b-field(label="GIF speed", label-position="on-border")
        b-select(v-model="gifParams.speedFactor")
          option(
            v-for="(value, i) in [0.1, 0.2, 0.5, 0.8, 1, 1.2, 1.5, 2, 3, 5]",
            :value="value",
            :key="i",
            :label="`${parseInt(100 * value)}` + '%'"
          )
    p.control
      b-field(label="GIF scale", label-position="on-border")
        b-select(v-model="gifParams.scale")
          option(
            v-for="(value, i) in [0.1, 0.2, 0.5, 0.8, 1, 1.2, 1.5, 2, 3, 5]",
            :value="value",
            :key="i",
            :label="`${parseInt(100 * value)}` + '%'"
          )
    p.control
      b-field(label="GIF FPS", label-position="on-border")
        b-select(v-model="gifParams.useDefaultFps")
          option(
            :value="true",
            :label="`Project FPS (${parseInt($store.state.project.fps)})`"
          )
          option(:value="false", label="Custom FPS")
    p.control(v-if="!gifParams.useDefaultFps")
      b-numberinput(v-model="gifParams.fps", controls-position="compact")
    p.control
      b-field(label="Transparency", label-position="on-border")
        b-select(v-model="gifParams.transparency")
          option(value="None", label="No transparency")
          option(value="#00FF00", label="Green background")
          option(value="#000000", label="Black background")
    p.control
      b-field(label="Dithering", label-position="on-border")
        b-select(v-model="gifParams.dithering")
          option(
            v-for="dithering in ditherings",
            :key="dithering",
            :value="dithering",
            :label="dithering"
          )
          option(value="floyd", label="Custom FPS")
  div(style="text-align: center; margin-top: 2em")
    div(v-if="!gifGeneration.inProgress")
      b-button.generate-gif-button(@click="generateGif", type="is-primary") Generate the GIF
    div(v-else)
      b-field.gif-export-progress-bars
        b-progress(
          format="percent",
          :max="100",
          show-value,
          :value="progressBarValue",
          :type="progressBarValue === 100 ? 'is-success' : 'is-info'"
        ) Frames rendering
      b-field.gif-export-progress-bars
        b-progress(
          format="percent",
          :max="100",
          show-value,
          :value="100 * (gifGeneration.progress.gif || 0)",
          :type="gifGeneration.progress.gif === 1 ? 'is-success' : 'is-info'"
        ) GIF creation

    .result(v-if="gifDataURL && !gifGeneration.inProgress")
      .rendered-gif
        b-field(grouped, position="is-centered")
          b-button(icon-left="download").
            Download the GIF ({{(0.75*gifDataURL.length / 1000000).toFixed(2)}}Mo)
          b-button(icon-left="clipboard", style="margin-left: 1em") Copy the GIF to clipboard
        img(:src="gifDataURL")
</template>
<script>
import { mapMutations } from 'vuex';
import GixPlayer from '../../../components/GixAnimation/GixPlayer.vue';
import { renderGixToGif } from '../../../gix-renderer/index';

export default {
  props: {
    isActive: { type: Boolean, default: false },
  },
  data() {
    return {
      gifGeneration: {
        inProgress: false,
        progress: {},
      },
      gifParams: {
        scale: 1,
        speedFactor: 1,
        useDefaultFps: true,
        fps: 15,
        transparency: 'None',
        dithering: 'None',
      },
      gifDataURL: null,
      ditherings: ['None', 'FloydSteinberg', 'FalseFloydSteinberg', 'Stucki', 'Atkinson'],
    };
  },
  methods: {
    ...mapMutations(['setFreezeGifPreview']),
    async generateGif() {
      this.gifGeneration = { inProgress: true, progress: { gif: 0, currentFrame: 1 } };
      this.setFreezeGifPreview(true);
      this.gifDataURL = await renderGixToGif(
        JSON.parse(JSON.stringify(this.$store.state.project)),
        {
          ...this.gifParams,
          fps: this.useDefaultFps ? this.$store.state.project.fps : this.gifParams.fps,
          frameServers: window.frameServers,
        },
        this.updateProgress,
      );
      this.setFreezeGifPreview(false);
      this.gifGeneration = { ...this.gifGeneration, inProgress: false };
    },
    updateProgress(progress) {
      this.gifGeneration = { ...this.gifGeneration, progress };
    },
  },
  components: {
    'gix-player': GixPlayer,
  },
  computed: {
    progressBarValue() {
      const { progress } = this.gifGeneration;
      if (progress.currentFrame) {
        return (100 * progress.currentFrame) / progress.numberOfFrames;
      }
      return 100;
    },
    progressBarLabel() {
      return this.gifGeneration.progress.gif ? 'Encoding the GIF...' : 'Rendering the frames...';
    },
  },
};
</script>
<style lang="scss">
.export-gif {
  .rendered-gif {
    display: block;
    max-width: 90%;
    margin-right: auto;
    margin-left: auto;
  }
  .gif-export-progress-bars {
    width: 90%;
    max-width: 400px;
    margin: 2em auto;
  }
  .gif-stats {
    text-align: left;
  }
  .generate-gif-button {
    margin: 2em auto 2em auto;
  }
}
</style>
