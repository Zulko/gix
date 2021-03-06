<template lang="pug">
.source-form
  crop-asset-preview(:element="element", v-if="tabIsActive")
  br
  p.click-me(v-if="usesDataUrl", @click="dialogIsVisible = true") Embedded asset
  div(v-if="element.subtype !== 'image'")
    time-crop-slider(:element="element", v-if="element.subtype !== 'image'")
    b-field(grouped, label="Speed (%)")
      p.control
        b-numberinput.number-input(
          size="is-small",
          controls-position="compact",
          :value="parseInt(100 * element.speedFactor)",
          @input="(v) => updateSpeed(v / 100)",
          :min="0",
          :max="500",
          :step="1"
        )
  br
  b-field(label="Source file")
    b-input(
      style="width: 100%",
      :value="usesDataUrl ? 'File' : element.url",
      :disabled="usesDataUrl"
    )
    p.control
      b-field
        a(:href="element.url", target="_blank")
          b-button(icon-left="open-in-new")
    p.control
      b-button(icon-left="pencil", @click="dialogIsVisible = true")
    p.control
      b-field(label="Type", label-position="on-border")
        b-select(
          :value="element.subtype",
          @input="(v) => updateElement({ subtype: v })",
          size="mini"
        )
          option(
            v-for="(label, subtype) in subtypes",
            :value="subtype",
            :key="subtype",
            :label="label"
          )
  b-dialog(
    v-if="dialogIsVisible",
    append-to-body,
    @cancel="dialogIsVisible = false"
  )
    center
      h2 Load a new asset
      file-or-url-form(
        label="GIF/Image/Video URL or file",
        @urlInput="handleUrlInput",
        @fileInput="handleFileInput"
      )
</template>

<script>
import {
  urlToSubtype,
} from '../../../../../gix-renderer/FrameServer/autoDetectedFrameServer';
import FileOrUrlForm from '../../../../../components/widgets/FileOrUrlForm.vue';
import TimeCropSlider from './widgets/TimeCropSlider.vue';
import CropAssetPreview from './widgets/CropAssetPreview.vue';
import ElementComponentMixin from '../../ElementComponentMixin.vue';

export default {
  extends: ElementComponentMixin,
  props: {
    tabIsActive: { type: Boolean },
  },
  data() {
    return {
      urlInput: '',
      dialogIsVisible: false,
      subtypes: {
        gif: 'GIF',
        image: 'Picture',
        video: 'Video',
      },
    };
  },
  computed: {
    usesDataUrl() {
      return this.element.url.startsWith('data:');
    },
    simplifiedUrl() {
      let url = this.element.url
        .replace('https://', '')
        .replace('http://', '')
        .replace('www.', '');
      if (url.length > 30) {
        url = `${url.substring(0, 15)}…${url.substring(url.length - 15, url.length)}`;
      }
      return url;
    },
  },
  methods: {
    async handleUrlInput(urlData) {
      const extension = urlData.url
        .split('.')
        .pop()
        .toLowerCase();
      let subtype = urlToSubtype(extension);
      if (!subtype) {
        subtype = 'image';
      }
      this.dialogIsVisible = false;
      this.updateElement({ url: urlData.url, mediaUrl: urlData.mediaUrl, subtype });
    },
    handleFileInput(file) {
      const url = file.content;
      const subtype = 'image';
      this.dialogIsVisible = false;
      this.updateElement({ url, subtype });
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
  components: {
    'file-or-url-form': FileOrUrlForm,
    'time-crop-slider': TimeCropSlider,
    'crop-asset-preview': CropAssetPreview,
  },
  watch: {
    'element.url': async function elementURL() {
      //eslint-disable-line
      const { width, height } = this.$store.state.assetStats[this.element.url];
      this.updateElement({
        size: { width, height },
      });
    },
  },
};
</script>
