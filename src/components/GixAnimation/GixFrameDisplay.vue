// TODO: two SVGs, one for animated content, one for inanimated content

<template lang='pug'>
.gix-frame(:style="gixFrameStyle")
  svg-composition(
    v-if="!isLoading",
    :svgElements="svgElements",
    :svgWidth="project.canvas.width",
    :svgHeight="project.canvas.height",
    :scale="scale",
    :emitSVG="includeSVGInEmittedFrames",
    :inlineStylesInEmittedSVG="true",
    :backgroundColor="project.canvas.backgroundColor",
    @dragged="(evt) => $emit('dragged', evt)",
    @new-frame="(evt) => $emit('new-frame', evt)"
  )
  b-loading(:is-full-page="false", v-model="isLoading", :can-cancel="false")
</template>

<script>
import {
  initiateMissingFrameServers,
  findAssetElementsWithoutFrameServer,
} from '../../gix-renderer/FrameServer/autoDetectedFrameServer';
import { resolveElement, resolvedElementToSvg } from '../../gix-renderer';
// import data from './data';
import SvgComposition from './SvgComposition/SvgComposition.vue';

export default {
  props: {
    project: { default: () => ({}), type: Object },
    includeSVGInEmittedFrames: { default: false, type: Boolean },
    time: { default: 0, type: Number },
    scale: { default: 1, type: Number },
  },
  data() {
    return {
      svgElements: [],
      loading: {
        inProgress: false,
        total: 0,
        current: 0,
      },
      isLoading: false,
    };
  },
  methods: {
    async refreshElements() {
      const self = this;
      const missingServers = findAssetElementsWithoutFrameServer(this.project, window.frameServers);
      if (missingServers.length) {
        window.frameServers = await initiateMissingFrameServers(
          this.project,
          window.frameServers,
          () => {
            self.isLoading = true;
          },
        );
        const sourceStats = Object.fromEntries(
          Object.entries(window.frameServers).map(([name, server]) => [name, server.sourceStats]),
        );
        this.$store.commit('updateAssetStats', sourceStats);
        this.isLoading = false;
      }
      this.svgElements = await Promise.all(
        this.project.elements.map((element) => this.svgElementAtTime(element, this.time)),
      );
      this.$emit('new-frame');
    },
    async svgElementAtTime(element, t) {
      const resolvedElement = resolveElement(element, { time: t });
      const innerSVG = await resolvedElementToSvg(resolvedElement, {
        time: t,
        frameServers: window.frameServers,
      });
      return { ...resolvedElement, innerSVG };
    },
    getFrameFromFrameServer(element, t) {
      const assetDuration = element.timeCrop.end - element.timeCrop.start;
      const assetTime = element.speedFactor * (t - element.timeSegment.start);
      const isFrozen = element.endBehavior === 'freeze';
      const clipTime = isFrozen ? Math.min(assetTime, assetDuration) : assetTime % assetDuration;
      const adjustedAssetTime = element.timeCrop.start + clipTime;

      return window.frameServers[element.id].getFrame(adjustedAssetTime);
    },
  },
  computed: {
    frameServers: {
      get() {
        return this.$store.state.frameServers;
      },
      set(value) {
        this.$store.commit('updateFrameServers', value);
      },
    },
    gixFrameStyle() {
      return {
        width: `${this.project.canvas.width * this.scale}px`,
        height: `${this.project.canvas.height * this.scale}px`,
      };
    },
  },
  async mounted() {
    window.frameServers = {};
    await this.refreshElements();
  },
  components: {
    'svg-composition': SvgComposition,
  },
  watch: {
    time() {
      this.refreshElements();
    },
    'project.elements': {
      deep: true,
      handler() {
        this.refreshElements();
      },
    },
  },
};
</script>
<style>
.gix-frame {
  position: relative;
  display: block;
  margin: 0 auto;
  background: black;
}
</style>
