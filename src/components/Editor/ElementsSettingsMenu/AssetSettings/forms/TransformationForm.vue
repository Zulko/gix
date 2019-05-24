<template lang="pug">
.text-position-form
  el-form(label-width='120px')
    el-form-item(label='Dimensions WxH')
      el-input-number.inline-setting-widget(
        size='mini', controls-position="right", :min='0',
        :value='element.size.width',
        @input='v => updateElement({size: {width: v}})')
      el-input-number.inline-setting-widget(
        size='mini', controls-position="right", :min='0',
        :value='element.size.height',
        @input='v => updateElement({size: {height: v}})')
    el-form-item(label='Keep aspect ratio')
      el-checkbox(:value='aspectRatioCheckboxValue',
                  @change='changeAspectRatioCheckbox')
    hr
    el-form-item(label='Crop')
      div(v-for="direction in ['Top', 'Bottom', 'Left', 'Right']",
          style='display: inline-block; margin-right: 1em')
        span {{direction}}&nbsp;
        el-input-number.inline-setting-widget(
            size='mini', controls-position="right", :min='0',
            :value='element.crop[direction.toLowerCase()]',
            @input='v => updateCrop(v, direction)')
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
    updateCrop (v, direction) {
      var data = {crop: {}}
      data[direction.toLowerCase()] = v
      this.updateElement(data)
    },
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
