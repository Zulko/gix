<template lang="pug">
.source-form
  p.current-url(v-if='element.url.length')
    span Current URL:&nbsp;
    el-tooltip(effect='light')
      span(slot='content')
        el-button(v-for="icon, subtype in icons", :key='subtype', size='mini',
                  :type="element.subtype === subtype ? 'primary' : 'normal'"
                  @click="v => updateElement({subtype: subtype})")
          .icon(:is="icons[subtype]" , title='')
      el-button(style='display: inline;' size='mini' title='')
        .icon(:is='icons[element.subtype]')
    a(:href='element.url' target='_blank') {{element.url.substring(0, 50)}} {{ element.url.length > 50 ? '...': ''}}
  p Provide {{element.url.length ? 'another' : 'a'}} picture, GIF or Video (URL of local file)
  file-or-url-form(@urlInput='handleUrlInput', @fileInput='handleFileInput')

</template>

<script>
import FileOrUrlForm from '../../../../widgets/FileOrUrlForm'
import gifIcon from 'vue-material-design-icons/Gif.vue'
import imageIcon from 'vue-material-design-icons/Image.vue'
import movieIcon from 'vue-material-design-icons/Movie.vue'
import { urlToSubtype } from '../../../../GixAnimation/FrameServer'

export default {
  extends: require('../../ElementComponentMixin.vue').default,
  data () {
    return {
      urlInput: '',
      icons: {
        image: imageIcon,
        gif: gifIcon,
        movie: movieIcon
      }
    }
  },
  methods: {
    async handleUrlInput (url) {
      var extension = url.split('.').pop().toLowerCase()
      var subtype = urlToSubtype(extension) || 'image'
      this.updateElement({url, subtype})
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
