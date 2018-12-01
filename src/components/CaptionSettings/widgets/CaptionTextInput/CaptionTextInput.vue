<template lang="pug">
.caption-text-input
  el-input.caption-input(type="textarea" rows="1", autosize, :value='caption.text'
                         @input='val => updateCaption({text: val})'
                         :style="`font-family: '${caption.font.family}', 'Raleway' !important`")
  emoji-picker(@pick='val =>  updateCaption({text: caption.text + val})')
</template>

<script>
export default {
  extends: require('../../CaptionComponent.vue').default,
  components: {
    'emoji-picker': require('./EmojiPicker').default
  }
}
</script>

<style lang='scss'>
.caption-text-input {
  position: relative;
  textarea {
    font-size: 1.6em;
    font-weight: bold;
    text-align: center;
    font-family: inherit;
  }
}
</style>
