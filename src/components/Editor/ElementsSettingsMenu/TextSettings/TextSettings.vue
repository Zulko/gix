<template lang="pug">
element-settings(:element='element' :showOptions='showOptions').text-element-settings
  .main(slot='alwaysVisible')
    text-input(:element='element')
  template(slot='tabs')
    el-tabs
      el-tab-pane(v-for='pane in panes', :key='pane.tooltip')
        span(slot='label')
          el-tooltip(:content='pane.tooltip', placement='top')
            .icon(:is='pane.icon')
        div(:is='pane.form', :element='element')
</template>

<script>
import ElementsSettings from '../ElementSettings.vue'
import PositionForm from '../common_forms/PositionForm'
import ColorForm from '../common_forms/ColorForm.vue'
import TextInput from './forms/TextInput/TextInput'
import FontForm from './forms/FontForm/FontForm.vue'
import AnimationForm from '../common_forms/CssAnimationForm/CssAnimationForm.vue'
import TimeSegmentForm from '../common_forms/TimeSegmentForm.vue'

import formatIcon from 'vue-material-design-icons/FormatFont.vue'
import mapMarkerIcon from 'vue-material-design-icons/MapMarker.vue'
import timerIcon from 'vue-material-design-icons/AvTimer.vue'
import animationIcon from 'vue-material-design-icons/AnimationOutline.vue'
import colorIcon from 'vue-material-design-icons/FormatColorFill.vue'
export default {
  extends: require('../ElementComponentMixin.vue').default,
  data () {
    return {
      panes: [
        {
          tooltip: 'Position',
          title: 'Text position',
          icon: mapMarkerIcon,
          form: PositionForm
        },
        {
          tooltip: 'Time segment',
          title: 'Time segment',
          icon: timerIcon,
          form: TimeSegmentForm
        },
        {
          tooltip: 'Font',
          title: 'Text Font',
          icon: formatIcon,
          form: FontForm
        },
        {
          tooltip: 'Color',
          title: 'Text color',
          icon: colorIcon,
          form: ColorForm
        },
        {
          tooltip: 'Animation',
          title: 'Text animation',
          icon: animationIcon,
          form: AnimationForm
        }
      ]
    }
  },
  components: {
    'element-settings': ElementsSettings,
    'text-input': TextInput
  }
}
</script>
