<template lang="pug">
.element-settings
  slot(name='alwaysVisible')
  transition(enter-active-class='animated flipInX fast')
    .tabs(v-show='showOptions')
      slot(name='tabs')
</template>

<script>
export default {
  extends: require('./ElementComponentMixin.vue').default,
  props: {
    showOptions: {default: true}
  },
  data () {
    return {
      showToolbar: false
    }
  },
  methods: {
    tabClick (tab) {
      if (tab.label === 'animation') {
        this.$notifyOnce('animation-warning', {
          message: 'Animated elements may not find a font family if it is not installed on your machine.'
        })
      }
    }
  },
  components: {
    'element-toolbar': require('./ElementToolbar').default
  }
}
</script>
<style lang='scss'>
.element-settings {
  position: relative;
  display: block;
  margin-bottom: 3em !important;
  // background-color: #fffdff;
}
</style>
