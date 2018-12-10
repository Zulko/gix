<template lang="pug">
.text-position-form
  .inline-setting-text
    el-tooltip(content="Click me then click somewhere on the GIF")
      el-button(size='mini' circle,
                @click="awaitPositionClick()")
        .icon(:is="icons.map", title='')
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
          .icon(:is="icons[`format-align-${align}`]" , title='')
      el-button(size='mini')
        .icon(:is="icons[`format-align-${element.alignment.x}`]" , title='')
    el-tooltip(effect='light')
      span(slot='content')
        el-button(v-for="align in yAligns", :key='align' size='mini',
                  :type="element.position.yAlign === align ? 'primary' : 'normal'"
                  @click="v => updateElement({position: {yAlign: align}})")
          el-tooltip(:content="`Vertical align ${align}`")
            .icon(:is="icons[`format-vertical-align-${align}`]" , title='')
      el-button(size='mini')
        .icon(:is="icons[`format-vertical-align-${element.alignment.y}`]" , title='')
  .inline-setting-text
    .icon(:is="icons.linespacing" , title='')
  el-input-number.inline-setting-widget(
    size='mini', :min='0', controls-position="right"
    :value='element.position.lineHeight'
    @input='v => updateElement({position: {lineHeight: v}})')
</template>

<script>
import MapIcon from 'vue-material-design-icons/MapMarker'
import FormatAlignLeft from 'vue-material-design-icons/FormatAlignLeft'
import FormatAlignCenter from 'vue-material-design-icons/FormatAlignCenter'
import FormatAlignRight from 'vue-material-design-icons/FormatAlignRight'
import FormatVerticalAlignBottom from 'vue-material-design-icons/FormatVerticalAlignBottom'
import FormatVerticalAlignCenter from 'vue-material-design-icons/FormatVerticalAlignCenter'
import FormatVerticalAlignTop from 'vue-material-design-icons/FormatVerticalAlignTop'
import FormatLineSpacing from 'vue-material-design-icons/FormatLineSpacing'

export default {
  extends: require('../ElementComponentMixin.vue').default,
  data () {
    return {
      xAligns: ['left', 'center', 'right'],
      yAligns: ['top', 'center', 'bottom'],
      icons: {
        map: MapIcon,
        'format-align-left': FormatAlignLeft,
        'format-align-center': FormatAlignCenter,
        'format-align-right': FormatAlignRight,
        'format-vertical-align-bottom': FormatVerticalAlignBottom,
        'format-vertical-align-center': FormatVerticalAlignCenter,
        'format-vertical-align-top': FormatVerticalAlignTop,
        linespacing: FormatLineSpacing
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
  },
  components: {
    'map-icon': MapIcon
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
