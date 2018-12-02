<template lang='pug'>
.file-uploader
  el-upload(drag :file-list="fileList", :on-change='onNew',
            action='false', :auto-upload="false", :multiple='multiple')
    i.el-icon-upload
    .el-upload__text Drop a {{fileDescription}} file here or <em>click to upload</em>
    .el-upload__tip(slot="tip") {{tip}}
</template>
<script>
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
  }
}
</script>
<style lang='scss' scoped>
.file-uploader {
  display: block;
  text-align: center;
  margin-bottom: 1em;
}
</style>
