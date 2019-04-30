<template lang="pug">
el-container.editor
  el-aside(width="800px")
    elements-settings-menu
  el-main(style="padding: 1cm; padding-top: 1cm; overflow-x: hidden;")
    gix-animation-wrapper(v-if='this.$store.state.project.elements')
    gix-toolbar
</template>

<script>
import GixAnimationWrapper from './GixAnimationWrapper/GixAnimationWrapper'
import ElementsSettingsMenu from './ElementsSettingsMenu/ElementsSettingsMenu'
import Toolbar from './Toolbar/Toolbar'
import { mapMutations } from 'vuex'
export default {
  components: {
    'gix-animation-wrapper': GixAnimationWrapper,
    'elements-settings-menu': ElementsSettingsMenu,
    'gix-toolbar': Toolbar
  },
  methods: {
    ...mapMutations([
      'newEmptyProject',
      'setDefaultStartingProject',
      'addElement',
      'updateElement'
    ])
  },
  mounted () {
    this.newEmptyProject()
    console.log('BLA', this.$store.state.project)
    this.setDefaultStartingProject()
    // var elementId = this.$store.state.project.elements[0].id
    // this.updateElement({elementId, {subset: 'animated'} })
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
