<template lang="pug">
.source-form
  p Provide a picture, GIF or Video, either as a 
  p.current-url(v-if='element.url.length')
    span Current URL: {{element.url.substring(1, 20)}}
    span(v-if='element.url.length > 20') ...
  file-or-url-form(@update='handleUpdate')

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
  method: {
    handleUpdate () {
      console.log('hey')
    }
  },
  components: {
    'file-or-url-form': FileOrUrlForm
  }
}
</script>

<style lang='scss'>
.source-form {
}
</style>
