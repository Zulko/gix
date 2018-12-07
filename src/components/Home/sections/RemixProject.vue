<template lang='pug'>
el-row.home-remix-project(:gutter='50')
  el-col(:sm='10')
    el-card
      file-or-url-form(@urlInput='handleUrl', @fileInput='handleFileInput')
  el-col(:sm='8')
    h2 Remix a project
    p.
      Provide a GIF, video file, or picture to serve as a basis for your
      project, either as a URL or a file.
    p If you know what you are doing you can also #[a(href='#') start from a blank canvas].

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
.home-remix-project {
  h2 {
    margin-top: 0;
  }
}
</style>
