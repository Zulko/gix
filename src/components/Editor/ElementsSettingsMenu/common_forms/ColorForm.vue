<template lang="pug">
.element-color-form
  .inline-setting-text Text:
  el-color-picker.inline-setting-widget(v-model='element.color' show-alpha)
  .inline-setting-text Stroke:
  el-color-picker.inline-setting-widget(v-model='element.stroke.color' show-alpha)
  .inline-setting-text Stroke width:
  el-input-number.inline-setting-widget(v-model='element.stroke.width' size='mini',
                                        :min='0', style='width: 100px;',
                                        controls-position="right")
</template>

<script>
export default {
  extends: require('../ElementComponentMixin.vue').default
}
</script>

<style lang='scss'>
</style>
