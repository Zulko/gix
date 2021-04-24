<template lang="pug">
.source-form
  asset-preview(:element='element', :assetInfos='assetInfos')
  .current-url(v-if='!usesDataUrl', :title='element.url')
    center
      p {{simplifiedUrl}}
    b-field(grouped position='is-centered')
      p.control
        b-field
          a(:href='element.url' target='_blank')
            b-button(icon-left='open-in-new') Go to link
      p.control
        b-field
          b-button(icon-left='pencil' @click='dialogIsVisible = true') Change
      p.control
        b-field
          b-select(
            :value='element.subtype'
            @input='v => updateElement({subtype: v})' size='mini'
          )
            option(
              v-for="label, subtype  in subtypes"
              :value='subtype',
              :key='subtype',
              :label='label'
            )
  p.click-me(v-if='usesDataUrl' @click='dialogIsVisible = true') Embedded asset
  b-dialog(v-if='dialogIsVisible' append-to-body @cancel='dialogIsVisible = false')
    center
      h2 Load a new asset
      file-or-url-form(
        label='GIF/Image/Video URL or file'
        @urlInput='handleUrlInput',
        @fileInput='handleFileInput'
      )

</template>

<script>
import { autoDetectedFrameServer, urlToSubtype } from '@/gix-renderer/FrameServer/autoDetectedFrameServer';
import FileOrUrlForm from '@/components/widgets/FileOrUrlForm.vue';

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
        gif: 'This is a GIF',
        image: 'This is a picture',
        video: 'This is a video',
      },
    };
  },
  computed: {
    usesDataUrl() {
      return this.element.url.startsWith('data:');
    },
    simplifiedUrl() {
      let url = this.element.url.replace('https://', '').replace('http://', '').replace('www.', '');
      if (url.length > 30) {
        url = `${url.substring(0, 15)}…${url.substring(url.length - 15, url.length)}`;
      }
      return url;
    },
  },
  methods: {
    async handleUrlInput(url) {
      const extension = url.split('.').pop().toLowerCase();
      const subtype = urlToSubtype(extension) || 'image';
      this.dialogIsVisible = false;
      this.updateElement({ url, subtype });
    },
    handleFileInput(file) {
      const url = file.content;
      const subtype = 'image';
      this.dialogIsVisible = false;
      this.updateElement({ url, subtype });
    },
    async updateInfos() {
      const server = autoDetectedFrameServer(this.element.url);
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
    'element.url': async function (url) { //eslint-disable-line
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
