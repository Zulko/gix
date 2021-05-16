<template lang="pug">
.source-form
  b-field(:label="label")
    b-input(style="width: 100%", :value="element.url")
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
  asset-preview(:element="element", :assetInfos="assetInfos")
  p.click-me(v-if="usesDataUrl", @click="dialogIsVisible = true") Embedded asset
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
  autoDetectedFrameServer,
  urlToSubtype,
} from '../../../../../../../../gix-renderer/FrameServer/autoDetectedFrameServer';
import FileOrUrlForm from '../../../../../../../../components/widgets/FileOrUrlForm.vue';

import ElementComponentMixin from '../../ElementComponentMixin.vue';
import AssetPreview from './AssetPreview.vue';

export default {
  extends: ElementComponentMixin,
  data() {
    return {
      assetInfos: {},
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
    async updateInfos() {
      const server = await autoDetectedFrameServer(this.element);
      this.assetInfos = await server.getInfos();
    },
  },
  components: {
    'file-or-url-form': FileOrUrlForm,
    'asset-preview': AssetPreview,
  },
  mounted() {
    this.updateInfos();
  },
  watch: {
    'element.url': async function elementURL() {
      //eslint-disable-line
      await this.updateInfos();
      this.updateElement({
        size: {
          width: this.assetInfos.width,
          height: this.assetInfos.height,
        },
      });
    },
  },
};
// https://media.giphy.com/media/RQgzLsPYlzrBC/giphy.gif
// https://help.imgur.com/hc/en-us/article_attachments/115000241146/mindblown.gif
</script>
