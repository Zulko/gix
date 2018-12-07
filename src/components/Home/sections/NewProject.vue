<template lang='pug'>
el-row.home-new-project(:gutter='20')
  el-col(:sm='10', :offset='4')
    h2 Start a new project
    p.
      Provide a GIF, video file, or picture to serve as a basis for your
      project, either as a URL or a file.
    p If you know what you are doing you can also #[a(href='#') start from a blank canvas].
  el-col(:sm='10')
    el-card
      file-or-url-form(@urlInput='handleUrl', @fileInput='handleFileInput')
</template>
<script>
import FileOrUrlForm from '../../widgets/FileOrUrlForm'
export default {
  data () {
    return {}
  },
  methods: {
    handleUrl () {
    },
    handleFileInput () {
    }
  },
  components: {
    'file-or-url-form': FileOrUrlForm
  }
}
</script>
<style lang='scss'>
.home-new-project {
  h2 {
    margin-top: 0;
  }
}
</style>
