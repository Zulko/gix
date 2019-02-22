<template lang="pug">
.source-form
  p.current-url(v-if='element.url.length')
    span Current URL:&nbsp;
    a(:href='element.url' target='_blank') {{element.url.substring(0, 50)}} {{ element.url.length > 50 ? '...': ''}}
  p Provide {{element.url.length ? 'another' : 'a'}} picture, GIF or Video (URL of local file)
  file-or-url-form(@urlInput='handleUrlInput', @fileInput='handleFileInput')

</template>

<script>
import FileOrUrlForm from '../../../../widgets/FileOrUrlForm'
export default {
  extends: require('../../ElementComponentMixin.vue').default,
  data () {
    return {
      urlInput: ''
    }
  },
  methods: {
    async handleUrlInput (url) {
      this.updateElement({url})
    },
    handleFileInput (file) {
      console.log('heyfile', file)
    }
  },
  components: {
    'file-or-url-form': FileOrUrlForm
  }
}
// https://media.giphy.com/media/RQgzLsPYlzrBC/giphy.gif
// https://help.imgur.com/hc/en-us/article_attachments/115000241146/mindblown.gif
</script>

<style lang='scss'>
.source-form {
  .current-url {
    font-size: 0.8em;
  }
}
</style>
