<template lang='pug'>
.file-or-url-form
  .url-form
    b-field(:label="label")
      b-input(
        style="width: 100%",
        v-model="url",
        :placeholder="`URL of a public ${fileDescription}`"
      )
      p.control
        b-button(icon-left="check", @click="processAndEmitUrl")
  file-uploader(
    @input="(val) => $emit('fileInput', val)",
    :fileDescription="fileDescription",
    :tip="fileTip"
  )
</template>

<script>
import FileUploader from './FileUploader.vue';
import findMediaUrl from '../../gix-renderer/FrameServer/find-media-url';

export default {
  props: {
    fileTip: { default: '', type: String },
    fileDescription: { default: '', type: String },
    label: { type: String, default: '' },
  },
  components: {
    'file-uploader': FileUploader,
  },
  data() {
    return {
      url: 'https://www.youtube.com/watch?v=2qxp6SBBI3c',
      rules: {
        name: [
          {
            required: true,
            message: 'Please input Activity name',
            trigger: 'blur',
          },
          {
            min: 3,
            max: 5,
            message: 'Length should be 3 to 5',
            trigger: 'blur',
          },
        ],
      },
    };
  },
  methods: {
    async processAndEmitUrl() {
      const { url } = this;
      const urlMetadata = await findMediaUrl.findMediaUrl(url);
      if (urlMetadata) {
        this.$emit('urlInput', { url, mediaUrl: urlMetadata.url, title: urlMetadata.title });
      } else {
        this.$emit('urlInput', { url });
      }
    },
  },
};
</script>
<style lang='scss'>
.file-or-url-form {
  width: 100%;
  .file-uploader {
    width: 100%;
    margin: 1em auto;
    display: block;
  }
}
</style>
