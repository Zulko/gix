<template lang="pug">
.element-text-input
  el-input.element-input(type="textarea" rows="1", autosize, :value='element.text'
                         @input='val => updateElement({text: val})'
                         :style="`font-family: '${element.font.family}', 'Raleway' !important`")
  emoji-picker(@pick='val =>  updateElement({text: element.text + val})')
</template>

<script>
export default {
  extends: require('../../../ElementComponentMixin.vue').default,
  components: {
    'emoji-picker': require('./EmojiPicker').default
  }
}
</script>

<style lang='scss'>
.element-text-input {
  position: relative;
  textarea {
    font-size: 1.6em;
    font-weight: bold;
    text-align: center;
    font-family: inherit;
  }
}
</style>
