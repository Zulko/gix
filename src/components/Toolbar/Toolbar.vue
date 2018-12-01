<template lang="pug">
el-tabs.gix-toolbar
  el-tab-pane
    span(slot='label')
      el-tooltip(content='Time segment')
        icon(name='hourglass-half')
    h4.property-title Time segment
    el-slider(:value='[$store.state.project.source.transform.timeSegment.start, $store.state.project.source.transform.timeSegment.end]',
              :min='0',
              :max='$store.state.globals.source.duration',
              :step='0.01',
              range)
  el-tab-pane
    span(slot='label')
      el-tooltip(content='Crop and margin')
        icon(name='crop-alt')
    h4.property-title Crop and margin
  el-tab-pane
    span(slot='label')
      el-tooltip(content='GIF Parameters')
        icon(name='sliders-h')
    h4.property-title GIF Parameters
    .inline-setting-text FPS
    .inline-setting-widget
      el-input-number(v-model='$store.state.globals.source.fps' size='mini',
                      :min='0', :max='30',
                      style='width: 100px;',
                      controls-position="right")
  el-tab-pane
    span(slot='label')
      el-tooltip(content='Share and remix')
        icon(name='share')
    h4.property-title Share and remix later
  el-tab-pane
    span(slot='label')
      el-tooltip(content='Download the GIF')
        icon(name='arrow-down')
    h4.property-title Share and remix later
</template>
<script>
export default {
}
</script>

<style>
.gix-toolbar {
  max-width: 80%;
  margin: 0 auto;
}
</style>
