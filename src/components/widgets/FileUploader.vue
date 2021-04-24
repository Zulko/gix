<template lang='pug'>
b-upload.file-uploader(@input='onInput' :multiple='false' :drag-drop='true')
  section.section
    .content.has-text-centered
      p
        b-icon(icon='upload' size='is-large')
      p {{ uploadText }}
</template>
<script>

export default {
  props: {
    fileDescription: { default: '', type: String },
    tip: { default: '', type: String },
    uploadText: { default: 'Drop a file or click to upload', type: String },
    multiple: { default: false, type: Boolean },
  },
  data() {
    return {
      fileList: [],
    };
  },
  methods: {
    onInput(file) {
      const self = this;
      const reader = new window.FileReader();
      reader.onloadend = function f(ev) {
        if (ev.target.readyState === window.FileReader.DONE) {
          // file.content = ev.target.result;
          // file.status = 'success';
          self.$emit(
            'input',
            Object.assign(file, {
              content: ev.target.result,
              status: 'success',
            }),
          );
        }
      };
      if (file.raw) {
        reader.readAsDataURL(file.raw);
      } else {
        reader.readAsText(file);
      }
    },
  },
};
</script>
<style lang='scss'>
.file-uploader {
  display: block;
  text-align: center;
  width: 100%;
}
</style>
