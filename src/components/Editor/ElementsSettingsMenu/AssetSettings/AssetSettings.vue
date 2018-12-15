<template lang="pug">
element-settings(:element='element').text-element-settings
  .main(slot='alwaysVisible')
    asset-preview(:element='element')
  template(slot='tabs')
    el-tabs
      el-tab-pane(v-for='pane in panes', :key='pane.tooltip')
        span(slot='label')
          el-tooltip(:content='pane.tooltip')
            .icon(:is='pane.icon')
        div(:is='pane.form', :element='element')
</template>

<script>
import ElementsSettings from '../ElementSettings.vue'
import PositionForm from '../common_forms/PositionForm'
import SourceForm from './forms/SourceForm'
import AssetPreview from './AssetPreview'
import TransformationForm from './forms/TransformationForm.vue'
import AnimationForm from '../common_forms/CssAnimationForm/CssAnimationForm.vue'
import TimeSegmentForm from '../common_forms/TimeSegmentForm.vue'

import linkIcon from 'vue-material-design-icons/LinkVariant.vue'
import mapMarkerIcon from 'vue-material-design-icons/MapMarker.vue'
import timerIcon from 'vue-material-design-icons/AvTimer.vue'
import animationIcon from 'vue-material-design-icons/AnimationOutline.vue'
import cropIcon from 'vue-material-design-icons/Crop.vue'

export default {
  extends: require('../ElementComponentMixin.vue').default,
  data () {
    return {
      panes: [
        {
          tooltip: 'Source',
          title: 'Source',
          icon: linkIcon,
          form: SourceForm
        },
        {
          tooltip: 'Position',
          title: 'Position',
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
          tooltip: 'Transformations',
          title: 'Transformations',
          icon: cropIcon,
          form: TransformationForm
        },
        {
          tooltip: 'Animation',
          title: 'Animation',
          icon: animationIcon,
          form: AnimationForm
        }
      ]
    }
  },
  components: {
    'element-settings': ElementsSettings,
    'asset-preview': AssetPreview
  }
}
</script>
