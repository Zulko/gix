<template lang="pug">
.element-color-form
  el-form(label-width="90px")
    el-form-item(label='Fill')
      el-col(:span='6')
        el-color-picker.inline-setting-widget(
          size='small',
          :value='element.color',
          @input='v => updateElement({color: v})'
          show-alpha
        )
    el-form-item(label='Stroke')
      el-col(:span='6')
        el-color-picker(
          size='small',
          :value='element.stroke.color',
          @input='v => updateElement({stroke: {color: v}})'
        )
      el-col(:span='18')
        span(style='margin-right:1em;') Width:
        el-input-number(
          size='mini',
          :value='element.stroke.width',
          @input='v => updateElement({stroke: {width: v}})'
          :min='0', style='width: 100px;', :step='0.1',
          controls-position="right")
    el-form-item(label='Outline' v-if='element.outline')
      el-col(:span='6')
        el-color-picker(
          size='small',
          :value='element.outline.color',
          @input='v => updateElement({outline: {color: v}})'
        )
      el-col(:span='18')
        span(style='margin-right:1em;') Width:
        el-input-number(
          size='mini',
          :value='element.outline.width',
          @input='v => updateElement({outline: {width: v}})'
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
