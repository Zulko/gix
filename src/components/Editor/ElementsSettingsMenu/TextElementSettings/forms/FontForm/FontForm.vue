<template lang="pug">
.element-font-form
  font-picker(:value='element.font.family'
              @input='val => updateElement({font: {family: val}})')
  span.spacer
  el-tooltip(content='Font Size')
    el-input-number(:value='element.font.size'
                    @input='val => updateElement({font: {size: val}})'
                    size='mini' controls-position="right"
                    style='width: 100px;')
  span.spacer
  el-button-group
    el-tooltip(content='Bold text')
      el-button(
        size='mini'
        :type="element.font.bold ? 'primary' : 'normal'"
        @click="updateElement({font: {bold: !element.font.bold}})"
        ): icon(name='bold')
</template>

<script>
export default {
  extends: require('../../../ElementComponentMixin.vue').default,
  components: {
    'font-picker': require('./FontPicker.vue').default
  }
}
</script>

<style lang='scss'>
.element-font-form {
  .spacer {
    margin-right:20px;
  }
}
</style>
