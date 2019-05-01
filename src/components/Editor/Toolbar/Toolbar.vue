<template lang="pug">
el-tabs.gix-toolbar
  el-tab-pane(v-for='pane in panes', :key='pane.tooltip')
    span(slot='label')
      el-tooltip(:content='pane.tooltip')
        .icon(:is='pane.icon')
    div(:is='pane.form')
//- el-tabs.gix-toolbar
//-   el-tab-pane
//-     span(slot='label')
//-       el-tooltip(content='Time segment')
//-         icon(name='hourglass-half')
//-     h4.property-title Time segment
//-     el-slider(:value='[$store.state.project.source.transform.timeSegment.start, $store.state.project.source.transform.timeSegment.end]',
//-               :min='0',
//-               :max='$store.state.globals.source.duration',
//-               :step='0.01',
//-               range)
//-   el-tab-pane
//-     span(slot='label')
//-       el-tooltip(content='Crop and margin')
//-         icon(name='crop-alt')
//-     h4.property-title Crop and margin
//-   el-tab-pane
//-     span(slot='label')
//-       el-tooltip(content='GIF Parameters')
//-         icon(name='sliders-h')
//-     h4.property-title GIF Parameters
//-     .inline-setting-text FPS
//-     .inline-setting-widget
//-       el-input-number(v-model='$store.state.globals.source.fps' size='mini',
//-                       :min='0', :max='30',
//-                       style='width: 100px;',
//-                       controls-position="right")
//-   el-tab-pane
//-     span(slot='label')
//-       el-tooltip(content='Share and remix')
//-         icon(name='share')
//-     h4.property-title Share and remix later
//-   el-tab-pane
//-     span(slot='label')
//-       el-tooltip(content='Download the GIF')
//-         icon(name='arrow-down')
//-     h4.property-title Share and remix later
</template>
<script>
import TimeForm from './forms/TimeForm.vue'
import SaveAndShareForm from './forms/SaveAndShareForm.vue'
import GifGenerationForm from './forms/GifGenerationForm.vue'
import SizeForm from './forms/SizeForm.vue'
// import linkIcon from 'vue-material-design-icons/LinkVariant.vue'
// import mapMarkerIcon from 'vue-material-design-icons/MapMarker.vue'
import timerIcon from 'vue-material-design-icons/AvTimer.vue'
import cloudDownloadOutline from 'vue-material-design-icons/CloudDownloadOutline.vue'
import gifIcon from 'vue-material-design-icons/Gif.vue'
import ResizeIcon from 'vue-material-design-icons/Resize'
// import animationIcon from 'vue-material-design-icons/AnimationOutline.vue'
// import cropIcon from 'vue-material-design-icons/Crop.vue'
// import gifIcon from 'vue-material-design-icons/Gif'

export default {
  data () {
    return {
      assetInfos: {},
      panes: [
        {
          tooltip: 'Duration and FPS',
          title: 'Duration',
          icon: timerIcon,
          form: TimeForm
        },
        {
          tooltip: 'GIF size',
          title: 'GIF size',
          icon: ResizeIcon,
          form: SizeForm
        },
        {
          tooltip: 'Save and Share',
          title: 'Duration',
          icon: cloudDownloadOutline,
          form: SaveAndShareForm
        },
        {
          tooltip: 'Generate the GIF',
          title: 'GIF',
          icon: gifIcon,
          form: GifGenerationForm
        }
        // {
        //   tooltip: 'Position',
        //   title: 'Position',
        //   icon: mapMarkerIcon,
        //   form: PositionForm
        // },
        // {
        //   tooltip: 'Time segment',
        //   title: 'Time segment',
        //   icon: timerIcon,
        //   form: TimeSegmentForm
        // },
        // {
        //   tooltip: 'Transformations',
        //   title: 'Transformations',
        //   icon: cropIcon,
        //   form: TransformationForm
        // },
        // {
        //   tooltip: 'Animation',
        //   title: 'Animation',
        //   icon: animationIcon,
        //   form: AnimationForm
        // }
      ]
    }
  }
}
</script>

<style>
.gix-toolbar {
  max-width: 80%;
  margin: 1.5em auto;
}
</style>
