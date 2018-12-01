<template lang="pug">
.text-position-form
  .inline-setting-text
    el-tooltip(content="Click me then click somewhere on the GIF")
      el-button(size='mini' circle,
                @click="awaitPositionClick()")
        icon(name='map-marker-alt')
  el-input-number.inline-setting-widget(
    size='mini', controls-position="right", :min='0',
    :value='caption.position.x',
    @input='v => updateCaption({position: {x: v}})')
  el-input-number.inline-setting-widget(
    size='mini', controls-position="right", :min='0',
    :value='caption.position.y',
    @input='v => updateCaption({position: {y: v}})')
  .inline-setting-text
  el-button-group.inline-setting-widget
    el-tooltip(effect='light')
      span(slot='content')
        el-button(v-for="align in xAligns", :key='align', size='mini',
                  :type="caption.position.xAlign === align ? 'primary' : 'normal'"
                  @click="v => updateCaption({position: {xAlign: align}})")
          icon(:name='`align-${align}`')
      el-button(size='mini')
        icon(:name='`align-${caption.position.xAlign}`')
    el-tooltip(effect='light')
      span(slot='content')
        el-button(v-for="align in yAligns", :key='align' size='mini',
                  :type="caption.position.yAlign === align ? 'primary' : 'normal'"
                  @click="v => updateCaption({position: {yAlign: align}})")
          el-tooltip(:content="`Vertical align ${align}`")
            icon(:name="carets[align]")
      el-button(size='mini')
        icon(:name="carets[caption.position.yAlign]")
  .inline-setting-text
    icon(name='text-height')
  el-input-number.inline-setting-widget(
    size='mini', :min='0', controls-position="right"
    :value='caption.position.lineHeight'
    @input='v => updateCaption({position: {lineHeight: v}})')
</template>

<script>
export default {
  extends: require('../CaptionComponent.vue').default,
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
          caption: this.caption
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
