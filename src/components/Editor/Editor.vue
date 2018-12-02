<template lang="pug">
el-container.editor
  el-aside(width="540px")
    captions-settings-list
  el-main(style="padding: 1cm; padding-top: 0cm; overflow-x: hidden;")
    captioned-frames-wrapper
    gix-toolbar
</template>

<script>
import CaptionedFramesWrapper from '../CaptionedFrames/CaptionedFramesWrapper'
import CaptionsSettingsList from './CaptionSettings/CaptionsSettingsList'
import Toolbar from './Toolbar/Toolbar'
export default {
  components: {
    'captioned-frames-wrapper': CaptionedFramesWrapper,
    'captions-settings-list': CaptionsSettingsList,
    'gix-toolbar': Toolbar
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang='scss'>
.editor {
  width: 1500px;
  max-width: 98%;
  margin: 0 auto;
}
</style>
