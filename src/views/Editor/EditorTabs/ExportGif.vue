<template lang="pug">
.export-gif
  b-field(group-multiline, grouped, style="margin-top: 2em")
    p.control
      b-field(label="Format", label-position="on-border")
        b-select(v-model="exportFormat")
          option(value="GIF", label="GIF because I'm a purist")
          option(value="mp4", label="MP4 because I can")

    p.control
      b-field(label="Speed", label-position="on-border")
        b-select(v-model="gifParams.speedFactor")
          option(
            v-for="(value, i) in [0.1, 0.2, 0.5, 0.8, 1, 1.2, 1.5, 2, 3, 5]",
            :value="value",
            :key="i",
            :label="`${parseInt(100 * value)}` + '%'"
          )
    p.control
      b-field(label="Scale", label-position="on-border")
        b-select(v-model="gifParams.scale")
          option(
            v-for="(value, i) in [0.1, 0.2, 0.5, 0.8, 1, 1.2, 1.5, 2, 3, 5]",
            :value="value",
            :key="i",
            :label="`${parseInt(100 * value)}` + '%'"
          )
    p.control
      b-field(label="FPS", label-position="on-border")
        b-select(v-model="gifParams.useDefaultFps")
          option(
            :value="true",
            :label="`Project FPS (${parseInt($store.state.project.fps)})`"
          )
          option(:value="false", label="Custom FPS")
    p.control(v-if="!gifParams.useDefaultFps")
      b-field(label="FPS", label-position="on-border")
        b-numberinput.numberinput(
          v-model="gifParams.fps",
          controls-position="compact"
        )
    p.control(v-if="exportFormat === 'GIF'")
      b-field(label="Transparency", label-position="on-border")
        b-select(v-model="gifParams.transparency")
          option(value="None", label="No transparency")
          option(value="#00FF00", label="Green background")
          option(value="#000000", label="Black background")
    p.control(v-if="exportFormat === 'GIF'")
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
      b-button.generate-gif-button(@click="generateGif", type="is-primary").
        Generate the {{ exportFormat }}
    div(v-else)
      b-field.gif-export-progress-bars
        b-progress(
          format="percent",
          :max="100",
          show-value,
          :value="progressBarValue",
          :type="progressBarValue === 100 ? 'is-success' : 'is-info'"
        ) Frames rendering
      b-field.gif-export-progress-bars(v-if="exportFormat === 'GIF'")
        b-progress(
          format="percent",
          :max="100",
          show-value,
          :value="100 * (gifGeneration.progress.gif || 0)",
          :type="gifGeneration.progress.gif === 1 ? 'is-success' : 'is-info'"
        ) {{ exportFormat }} creation

    .result(v-if="!gifGeneration.inProgress")
      div(v-if="exportFormat === 'GIF' && gifDataURL")
        .rendered-gif
          img(:src="gifDataURL")
          b-field(grouped, position="is-centered")
            a(:href="gifDataURL", :download="$store.state.project.infos.title")
              b-button(icon-left="download").
                Download ({{(0.75*gifDataURL.length / 1000000).toFixed(2)}}Mo)
      div(v-if="exportFormat === 'mp4' && mp4DataURL")
        .rendered-gif
          video(:src="mp4DataURL", autoplay=1, loop=1)
          b-field(grouped, position="is-centered")
            a(:href="mp4DataURL", :download="$store.state.project.infos.title")
              b-button(icon-left="download").
                Download ({{(0.75*mp4DataURL.length / 1000).toFixed(0)}}Ko)
</template>
<script>
import { mapMutations } from 'vuex';
import GixPlayer from '../../../components/GixAnimation/GixPlayer.vue';
import { renderGixToGif, renderGixToMp4 } from '../../../gix-renderer/index';

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
      exportFormat: 'GIF',
      gifDataURL: null,
      mp4DataURL: null,
      ditherings: ['None', 'FloydSteinberg', 'FalseFloydSteinberg', 'Stucki', 'Atkinson'],
    };
  },
  methods: {
    ...mapMutations(['setFreezeGifPreview']),
    async generateGif() {
      this.gifGeneration = { inProgress: true, progress: { gif: 0, currentFrame: 1 } };
      this.setFreezeGifPreview(true);
      if (this.exportFormat === 'GIF') {
        this.gifDataURL = await renderGixToGif(
          JSON.parse(JSON.stringify(this.$store.state.project)),
          {
            ...this.gifParams,
            fps: this.useDefaultFps ? this.$store.state.project.fps : this.gifParams.fps,
            frameServers: window.frameServers,
          },
          this.updateProgress,
        );
      } else if (this.exportFormat === 'mp4') {
        this.mp4DataURL = await renderGixToMp4(
          JSON.parse(JSON.stringify(this.$store.state.project)),
          {
            ...this.gifParams,
            fps: this.useDefaultFps ? this.$store.state.project.fps : this.gifParams.fps,
            frameServers: window.frameServers,
          },
          this.updateProgress,
        );
      }

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
  .numberinput {
    width: 150px;
  }
}
</style>
