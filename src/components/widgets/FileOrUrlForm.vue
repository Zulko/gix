<template lang='pug'>
.file-or-url-form
  .url-form
    b-field(:label='label')
      b-input(
        style='width: 100%;'
        v-model='url',
        :placeholder='`URL of a public ${fileDescription}`'
      )
      p.control
        b-button(
          icon-left='check',
          @click='(val) => $emit("urlInput", url)'
        )
  file-uploader(
    @input='(val) => $emit("fileInput", val)',
    :fileDescription='fileDescription',
    :tip='fileTip'
  )
</template>
<script>
import FileUploader from './FileUploader.vue';

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
    };
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
