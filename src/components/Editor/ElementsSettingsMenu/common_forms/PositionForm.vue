<template lang="pug">
.text-position-form
  .inline-setting-text
    el-tooltip(content="Click me then click somewhere on the GIF")
      el-button(size='mini' circle,
                @click="awaitPositionClick()")
        icon(name='map-marker-alt')
  el-input-number.inline-setting-widget(
    size='mini', controls-position="right", :min='0',
    :value='element.position.x',
    @input='v => updateElement({position: {x: v}})')
  el-input-number.inline-setting-widget(
    size='mini', controls-position="right", :min='0',
    :value='element.position.y',
    @input='v => updateElement({position: {y: v}})')
  .inline-setting-text
  el-button-group.inline-setting-widget
    el-tooltip(effect='light')
      span(slot='content')
        el-button(v-for="align in xAligns", :key='align', size='mini',
                  :type="element.position.xAlign === align ? 'primary' : 'normal'"
                  @click="v => updateElement({position: {xAlign: align}})")
          icon(:name='`align-${align}`')
      el-button(size='mini')
        icon(:name='`align-${element.position.xAlign}`')
    el-tooltip(effect='light')
      span(slot='content')
        el-button(v-for="align in yAligns", :key='align' size='mini',
                  :type="element.position.yAlign === align ? 'primary' : 'normal'"
                  @click="v => updateElement({position: {yAlign: align}})")
          el-tooltip(:content="`Vertical align ${align}`")
            icon(:name="carets[align]")
      el-button(size='mini')
        icon(:name="carets[element.position.yAlign]")
  .inline-setting-text
    icon(name='text-height')
  el-input-number.inline-setting-widget(
    size='mini', :min='0', controls-position="right"
    :value='element.position.lineHeight'
    @input='v => updateElement({position: {lineHeight: v}})')
</template>

<script>
export default {
  extends: require('../ElementComponentMixin.vue').default,
  data () {
    return {
      xAligns: ['left', 'center', 'right'],
      yAligns: ['top', 'middle', 'bottom'],
      carets: {
        top: 'caret-square-up',
        middle: 'minus-square',
        bottom: 'caret-square-down'
      }
    }
  },
  methods: {
    awaitPositionClick () {
      this.$store.commit('updateGlobals', {
        gifClickMode: {
          mode: 'position',
          element: this.element
        }
      })
    }
  }
}
</script>

<style lang="scss">
.text-position-form {
  .el-input-number {
    width: 80px;
  }
}
</style>
