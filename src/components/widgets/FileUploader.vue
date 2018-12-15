<template lang='pug'>
.file-uploader
  el-upload(drag :file-list="fileList", :on-change='onNew',
            action='false', :auto-upload="false", :multiple='multiple')
    .file-uploader-icon
      cloud-icon
    .el-upload__text ... Or provide a {{fileDescription}} file#[br] (drop or <em>click to upload)</em>
    .el-upload__tip(slot="tip") {{tip}}
</template>
<script>
import cloudIcon from 'vue-material-design-icons/CloudUploadOutline'
export default {
  props: {
    fileDescription: {default: ''},
    tip: {default: ''},
    multiple: {default: false}
  },
  data () {
    return {
      fileList: []
    }
  },
  methods: {
    onNew (file, fileList) {
      var self = this
      var reader = new window.FileReader()
      reader.onloadend = function (ev) {
        if (ev.target.readyState === window.FileReader.DONE) {
          file.content = ev.target.result
          file.status = 'success'
          self.$emit('input', file)
        }
      }
      reader.readAsDataURL(file.raw)
    }
  },
  components: {
    'cloud-icon': cloudIcon
  }
}
</script>
<style lang='scss'>
.file-uploader {
  display: block;
  .el-upload-dragger, .el-upload {
    display: block;
    width: 100%;
  }
  text-align: center;
  margin-bottom: 1em;
  .file-uploader-icon {
     svg {
      path {
        fill: #aaa;
      }
      margin-top: 30px;
      // margin-bottom: -20px;
      height: auto;
      width: 80px;
    }
  }
}
</style>
