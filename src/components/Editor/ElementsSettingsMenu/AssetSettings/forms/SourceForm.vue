<template lang="pug">
.source-form
  center
    div(v-if='element.url.length')
    p.current-url(v-if='!usesDataUrl', :title='element.url')
      span.click-me(@click='dialogIsVisible = true') {{simplifiedUrl}}
      a(v-if='!usesDataUrl'
        :href='element.url' target='_blank' style='color: black;', :title='element.url')
        open-in-new-icon(width=12)
    p.click-me(v-else @click='dialogIsVisible = true') Embedded asset
    el-select(:value='element.subtype' @input='v => updateElement({subtype: v})' size='mini', style='width: 250px')
      el-option(v-for="label, subtype  in subtypes" :value='subtype', :key='subtype', :label='label')
  el-dialog(:visible.sync='dialogIsVisible'  append-to-body)
    center
      h2
        span Load a new asset
        br
        span(style='font-size: 0.8em') (GIF, image, video)
      div(style='max-width: 600px; margin-bottom: 5em')
        file-or-url-form(@urlInput='handleUrlInput', @fileInput='handleFileInput')

</template>

<script>
import FileOrUrlForm from '../../../../widgets/FileOrUrlForm'
import openInNew from 'vue-material-design-icons/OpenInNew'
import { urlToSubtype } from '../../../../GixAnimation/FrameServer'

export default {
  extends: require('../../ElementComponentMixin.vue').default,
  data () {
    return {
      urlInput: '',
      dialogIsVisible: false,
      subtypes: {
        'gif': 'This is a GIF',
        'image': 'This is an image (JPEG, PNG…)',
        'video': 'This is a video (MP4, WEBM…)'
      }
    }
  },
  computed: {
    usesDataUrl () {
      console.log(this.element.url)
      return this.element.url.startsWith('data:')
    },
    simplifiedUrl () {
      var url = this.element.url.replace('https://', '').replace('http://', '').replace('www.', '')
      if (url.length > 30) {
        url = url.substring(0, 15) + '…' + url.substring(url.length - 15, url.length)
      }
      return url
    }
  },
  methods: {
    async handleUrlInput (url) {
      var extension = url.split('.').pop().toLowerCase()
      var subtype = urlToSubtype(extension) || 'image'
      this.dialogIsVisible = false
      this.updateElement({url, subtype})
    },
    handleFileInput (file) {
      console.log('heyfile', file)
      var url = file.content
      var mimetype = url.substring(5, url.indexOf(';'))
      console.log(mimetype)
      var subtype = 'image'
      this.dialogIsVisible = false
      this.updateElement({url, subtype})
    }
  },
  components: {
    'file-or-url-form': FileOrUrlForm,
    'open-in-new-icon': openInNew
  }
}
// https://media.giphy.com/media/RQgzLsPYlzrBC/giphy.gif
// https://help.imgur.com/hc/en-us/article_attachments/115000241146/mindblown.gif
</script>

<style lang='scss'>
.source-form {
  .current-url {
    text-align: center;
  }
  .open-in-new-icon svg{
    height: 14px;
    &:hover {
      fill: blue;
    }
  }
  .click-me {
    color: #62a3e1;
    cursor: pointer;
  }
}
</style>
