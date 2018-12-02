<template lang="pug">
.caption-color-form
  .inline-setting-text Text:
  el-color-picker.inline-setting-widget(v-model='caption.font.color' show-alpha)
  .inline-setting-text Stroke:
  el-color-picker.inline-setting-widget(v-model='caption.font.stroke.color' show-alpha)
  .inline-setting-text Stroke width:
  el-input-number.inline-setting-widget(v-model='caption.font.stroke.width' size='mini',
                                        :min='0', style='width: 100px;',
                                        controls-position="right")
</template>

<script>
export default {
  extends: require('../CaptionComponent.vue').default
}
</script>

<style lang='scss'>
</style>
