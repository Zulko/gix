<template lang="pug">
el-container.editor
  el-aside(width="540px")
    captions-settings-list
  el-main(style="padding: 1cm; padding-top: 0cm; overflow-x: hidden;")
    h2 GIF
    captioned-frames-wrapper
    gix-toolbar
</template>

<script>

export default {
  components: {
    'captioned-frames-wrapper': require('./CaptionedFrames/CaptionedFramesWrapper.vue').default,
    'captions-settings-list': require('./CaptionSettings/CaptionsSettingsList.vue').default,
    'gix-toolbar': require('./Toolbar/Toolbar.vue').default
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
