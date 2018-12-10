<template lang="pug">
el-tab-pane
  span(slot='label')
    el-tooltip(content='Colors')
      .icon(:is='iconComponent')
  h4.property-title Text and stroke colors
  p bla
</template>

<script>
const iconComponents = {}
export default {
  props: {
    icon: {default: 'map-pin'},
    title: {default: 'Text position'}
  },
  computed: {
    iconComponent () {
      return iconComponents[this.icon]
    }
  }
}
</script>
