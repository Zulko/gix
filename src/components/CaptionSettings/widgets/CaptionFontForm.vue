<template lang="pug">
.caption-font-form
  font-picker(:value='caption.font.family'
              @input='val => updateCaption({font: {family: val}})')
  span.spacer
  el-tooltip(content='Font Size')
    el-input-number(:value='caption.font.size'
                    @input='val => updateCaption({font: {size: val}})'
                    size='mini' controls-position="right"
                    style='width: 100px;')
  span.spacer
  el-button-group
    el-tooltip(content='Bold text')
      el-button(
        size='mini'
        :type="caption.font.bold ? 'primary' : 'normal'"
        @click="updateCaption({font: {bold: !caption.font.bold}})"
        ): icon(name='bold')
</template>

<script>
export default {
  extends: require('../CaptionComponent.vue').default,
  components: {
    'font-picker': require('./FontPicker.vue').default
  }
}
</script>

<style lang='scss'>
.caption-font-form {
  .spacer {
    margin-right:20px;
  }
}
</style>
