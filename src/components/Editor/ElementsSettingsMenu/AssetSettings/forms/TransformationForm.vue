<template lang="pug">
.text-position-form
  .inline-setting-text
    .icon(:is="icons.resize", title='')
  el-input-number.inline-setting-widget(
    size='mini', controls-position="right", :min='0',
    :value='element.size.width',
    @input='v => updateElement({size: {width: v}})')
  el-input-number.inline-setting-widget(
    size='mini', controls-position="right", :min='0',
    :value='element.size.height',
    @input='v => updateElement({size: {height: v}})')
  .inline-setting-text
  el-button-group.inline-setting-widget
    el-tooltip(effect='light')
      span(slot='content')
        el-button(v-for="align in xAligns", :key='align', size='mini',
                  :type="element.position.xAlign === align ? 'primary' : 'normal'"
                  @click="v => updateElement({position: {xAlign: align}})")
          .icon(:is="icons[`format-align-${align}`]" , title='')
      el-button(size='mini')
        .icon(:is="icons[`format-align-${element.xAlign}`]" , title='')
    el-tooltip(effect='light')
      span(slot='content')
        el-button.alignment-button(v-for="align in yAligns", :key='align' size='mini',
                  :type="element.position.yAlign === align ? 'primary' : 'normal'"
                  @click="v => updateElement({position: {yAlign: align}})")
          el-tooltip(:content="`Vertical align ${align}`")
            .icon(:is="icons[`format-vertical-align-${align}`]" , title='')
      el-button(size='mini')
        .icon(:is="icons[`format-vertical-align-${element.yAlign}`]" , title='')
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
import ResizeIcon from 'vue-material-design-icons/Resize'

export default {
  extends: require('../../ElementComponentMixin.vue').default,
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
        resize: ResizeIcon,
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
    width: 70px;
  }
  button {
    padding: 8px !important;
  }
}
</style>
