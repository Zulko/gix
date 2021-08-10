<template lang='pug'>
.file-or-url-form
  b-loading(:is-full-page="false", v-model="isLoading", :can-cancel="false")
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
    @input="processAndEmitFile",
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
      url: '',
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
      isLoading: false,
    };
  },
  methods: {
    async processAndEmitUrl() {
      const url = ['gif', 'mp4', 'webp'].reduce((ur, ext) => {
        if (ur.includes(`.${ext}?`)) {
          const [name] = ur.split(`.${ext}?`);
          return `${name}.${ext}`;
        }
        return ur;
      }, this.url);
      this.isLoading = true;
      try {
        const urlMetadata = await findMediaUrl.findMediaUrl(url);
        this.isLoading = false;
        if (urlMetadata) {
          this.$emit('urlInput', { url, mediaUrl: urlMetadata.url, title: urlMetadata.title });
        } else {
          this.$emit('urlInput', { url });
        }
      } catch (error) {
        console.error(error);
        this.$emit('urlInput', { url });
      }
      this.isLoading = false;
    },
    processAndEmitFile(file) {
      const reader = new FileReader();
      const self = this;
      reader.onload = function onload() {
        self.$emit('urlInput', { url: reader.result });
      };
      reader.onerror = function onerror(error) {
        throw error;
      };
      reader.readAsDataURL(file);
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
