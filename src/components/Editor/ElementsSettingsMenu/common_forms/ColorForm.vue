<template lang="pug">
.element-color-form
  .inline-setting-text Fill:
  el-color-picker.inline-setting-widget(
    :value='element.color',
    @input='v => updateElement({color: v})'
    show-alpha
  )
  .inline-setting-text Stroke:
  el-color-picker.inline-setting-widget(
    :value='element.stroke.color',
    @input='v => updateElement({stroke: {color: v}})'
  )
  .inline-setting-text Stroke width:
  el-input-number.inline-setting-widget(
    :value='element.stroke.width',
    @input='v => updateElement({stroke: {width: v}})'
    :min='0', style='width: 100px;', :step='0.1',
    controls-position="right")
</template>

<script>
export default {
  extends: require('../ElementComponentMixin.vue').default
}
</script>

<style lang='scss'>
</style>
