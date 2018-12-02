<template lang='pug'>
.file-or-url-form
  el-input(v-model='url')
    el-button(slot='append' icon='el-icon-check' @click="val => $emit('urlInput', url)")
  file-uploader(@input="val => $emit('fileInput', val)", :tip='filetip')
</template>
<script>
import FileUploader from '../widgets/FileUploader'
export default {
  props: {
    filetip: {default: ''}
  },
  components: {
    'file-uploader': FileUploader
  },
  data () {
    return {
      url: '',
      rules: {
        name: [
          { required: true, message: 'Please input Activity name', trigger: 'blur' },
          { min: 3, max: 5, message: 'Length should be 3 to 5', trigger: 'blur' }
        ]
      }
    }
  }
}
</script>
<style lang='scss'>
.file-or-url-form {
  width: 100%;
  .file-uploader {
    width: 100%;
    margin: 1em auto;
    display: block;
  }
  .el-upload, .el-upload-dragger {
    border-radius: 2em;
    width: 100%;
  }
}
</style>
