<template lang="pug">
.element-settings
  el-tooltip(content='Toggle options' placement="right")
    .options-toggle
      el-button(circle @click='showToolbar = !showToolbar')
        icon(name='sliders-h' scale="1.1")
  el-card
    span(slot='header')
      element-toolbar(:element='element')
    slot(name='alwaysVisible')
    transition(enter-active-class='animated flipInX fast')
      .tabs(v-show='showToolbar')
        slot(name='tabs')
</template>

<script>
export default {
  extends: require('./ElementComponentMixin.vue').default,
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
  .options-toggle {
    position: absolute;
    margin-top: -12px;
    z-index: 10000;
    button  {
      span {
        padding-left: .5px !important;
        padding-right: .5px !important;
      }
    }
  }
  .el-card {
    margin-left: 12px;
    margin-right: 12px;
  }
  .el-card__header {
     background-color: #bdddfc !important;
     padding: 1mm !important;
  }
  .el-card__body {
    padding: 1mm 4mm 4mm 4mm;
  }
  .el-tabs__content {
    padding: 0em 0.8em 0em 0.8em !important;
  }
  .property-title {
    font-weight: bold;
    text-transform: capitalize;
    color: gray;
    margin: 0 0 0.5em 0;
    text-align: center;
  }
  .el-input-number.is-controls-right .el-input__inner {
    padding-left: 2px;
     padding-right: 30px;
  }
  .el-tabs__item {
    padding-top: 5px !important ;
    svg {
      height: 20px;
    }
  }
  .icon svg {
    height: 20px;
  }
}
</style>
