<template lang="pug">
.element-font-form
  el-form(label-width="120px")
    el-form-item(label='Font')
      font-picker(:value='element.font.family'
                  @input='val => updateElement({font: {family: val}})')
    el-form-item(label='Font size')
      el-input-number(:value='element.font.size'
                      @input='val => updateElement({font: {size: val}})'
                      size='mini' controls-position="right"
                      style='width: 100px;')
    el-form-item(label='Line height')
      el-input-number(
        size='mini', :min='0', controls-position="right", :step='0.05',
         style='width: 100px;'
        :value='element.font.lineHeight'
        @input='v => updateElement({font: {lineHeight: v}})')
    el-form-item(label='Bold')
      el-checkbox(size='mini',
                  :value='element.font.bold',
                  @input='val => updateElement({font: {bold: val}})')
</template>

<script>
export default {
  extends: require('../../../ElementComponentMixin.vue').default,
  components: {
    'font-picker': require('./FontPicker.vue').default
  }
}
</script>
